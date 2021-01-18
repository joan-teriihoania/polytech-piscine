const express = require('express')
const server = express()
const fs = require('fs');
const fm = require('./fileManager');
var cookieParser = require('cookie-parser'); // module for parsing cookies
const { nextTick } = require('process');
const { encrypt, decrypt } = require('./crypto');
const sqlite = require('sqlite3')
const db = require('./db')
let ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config();
const path = require("path");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const mongoose = require("mongoose");
const sessions = require("client-sessions");

const auth = require("./auth");
const models = require("./models");
const settings = require("./settings");


// init DB 
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

var routes = {}

/*
  Read the router.json file to retrieve data about the routes
  and path for the website to load their views
*/
server.set('view engine', 'ejs')
server.use(cookieParser());
server.use(express.static('public'));
server.use(express.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({ extended: true }));

// login
server.use(sessions({
  cookieName: "session",
  secret: settings.SESSION_SECRET_KEY,
  duration: settings.SESSION_DURATION,
  activeDuration: settings.SESSION_EXTENSION_DURATION,
  cookie: {
    httpOnly: true,
    ephemeral: settings.SESSION_EPHEMERAL_COOKIES,
    secure: settings.SESSION_SECURE_COOKIES
  }
}));

server.use(csurf({cookie:true}));

// error handling
server.all("*", function(req, res, next){
  auth.loadUserFromSession(req, res, function(err){
    next()
  })
});

// fin login



loggerRequest = {}
setInterval(function(){
    loggerRequest = {}
}, 1000)


server.all('*', function(req, res, next){
    res.ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress

    if(!loggerRequest[res.ip] || isNaN(loggerRequest[res.ip])){ loggerRequest[res.ip] = 0 }
    loggerRequest[res.ip] = loggerRequest[res.ip] + 1

    if(loggerRequest[res.ip] > process.env.MAX_REQUEST_PER_SECOND){
        res.status(429)
        res.send("Too many requests")
        return
    }

    if (req.url != "" && req.url != "/" && req.url.endsWith('/')) {
        res.redirect(req.url.substr(0, req.url.length - 1))
        return
    }

    next()
})

server.get('*', function(req, res, next){
    next()
})

server.listen(process.env.PORT, function(){
    console.log("[EXPRESS] Server listening on port " + process.env.PORT)
})


// LOAD ROUTING PATH
fs.readFile("./router.json", function(err, routerContent){
    routes = JSON.parse(routerContent)
    for (const [path, view_info] of Object.entries(routes['views'])) {
        console.log("[ROUTER] View '" + view_info['filename'] + "' linked to '" + path + "' and '/ajax" + path + "'")

        server.get(path, function(req, res, next) {
            if(!req.user && view_info.login){
                res.status(401)
                render_page({"filename": "login", "title": "Connexion"}, req, res)
                return false
            }

            if(!req.user && view_info['admin']){
                res.status(403)
                render_page({"filename": "403", "title": "Accès refusé"}, req, res)
                return false
            }

            if(req.user && view_info['admin'] && !req.user.isAdmin){
                res.status(403)
                render_page({"filename": "403", "title": "Accès refusé"}, req, res)
                return false
            }

            render_page(view_info, req, res)
        });
        
        server.get("/ajax" + path, function(req, res, next) {
            if(!req.user && view_info.login){
                res.status(401)
                render_page({"filename": "login", "title": "Connexion"}, req, res)
                return false
            }

            if(!req.user && view_info['admin']){
                res.status(403)
                render_page({"filename": "403", "title": "Accès refusé"}, req, res)
                return false
            }

            if(req.user && view_info['admin'] && !req.user.isAdmin){
                res.status(403)
                render_page({"filename": "403", "title": "Accès refusé"}, req, res)
                return false
            }
            
            render_page(view_info, req, res, false)
        });
    }

    for (const [method, paths] of Object.entries(routes['api'])) {
      for (const [path, api_info] of Object.entries(paths)) {
        console.log("[ROUTER] API '" + api_info['filename'] + "' linked to <"+method+"> '" + process.env.API_PATH_PREF + path + "'")

        server.all(process.env.API_PATH_PREF + path, function(req, res, next) {
            if(req.method != method) return next()

            if(!req.user && api_info.login){
                res.status(401)
                res.end("Echec d'authentification : Vous devez être connecté pour accéder à cette page ou faire cette action.")
                return
            }

            if(api_info.admin && (!req.user || !req.user.isAdmin)){
                res.status(401)
                res.end("L'accès à cet API est réservé aux administrateurs")
                return
            }

            var temp = require("./api/" + api_info['filename'])
            temp.exec(req, res, next)
        });
      }
    }
    
    server.all(process.env.API_PATH_PREF + "/*", function(req, res, next) {
        res.status(404)
        res.end("Cannot link " + req.method + " "+req.url+" to any API script")
    })

    server.get("*", function(req, res, next) {
        res.status(404)
        render_page({"filename": "404", "title": "Page introuvable"}, req, res)
    })
})

// Clear empty groups
setInterval(function(){
  db.selectAll('groupes', {}, {}, function(groups){
    for(const [i, group] of Object.entries(groups)){
      db.selectAll('users', {group_id: group._id.toString()}, {}, function(members){
        if(members.length == 0){
          db.deleteOne("groupes", {_id: group._id.toString()}, function(result){
            console.log("[CLEANING] Group " + group._id.toString() + " deleted (empty)")
          })
        }
      })
    }
  })
}, 5000)

// FUNCTIONS

function render_page(view, req, res, use_framework=true, replaceValues = {}, callback = () => {}){
    fs.readFile("./views/framework.ejs", function(err, framework){
        if(err){console.log(err)}
        if(use_framework){
            framework = framework.toString()
        } else {
            framework = "{{ page }}"
        }

        fs.readFile("./views/pages/" + view['filename'] + ".ejs", function(err, page){
            if(!err){
                var promise

                try {
                    var pageController = require('./views/controllers/' + view['filename'] + '.js')
                    
                    promise = new Promise(function(resolve, reject){
                      pageController.format(page.toString(), {}, req, res, [], function(page, params){
                          resolve([page, params])
                      })
                    })
                } catch(err) {
                    promise = new Promise(function(resolve, reject){
                        resolve([page.toString(), {}])
                    })
                }
                
                promise.then(function(returned){
                    page = returned[0]
                    params = returned[1]
                    if(page == false){return}
                    framework = replaceAll(framework, '{{ page }}', page)
                    fs.readdir("./public/js", (err, js_scripts) => {
                        js_scripts_embed = ""
                        if(js_scripts && js_scripts.length > 0){
                          for(js_script of js_scripts){
                              if(js_script == "autorefresh.js" && !view.autorefresh){continue}
                              js_scripts_embed += '<script src="/js/'+js_script+'"></script>\n'
                          }
                        }

                        framework = framework.replace(/{{ js_scripts }}/gi, js_scripts_embed)
                        setTimeout(function(){
                          if(!res.headersSent){
                            res.redirect('back')
                          }
                        }, 5000)
                        if(!res.headersSent){
                          if(framework && params){
                            params['page_title'] = view['title']
                            params['req'] = req
                            params['db'] = db
                            if(!db.isConnected() || !params['req']){
                              res.status(500)
                              res.send("DB-ERROR: Please retry.")
                              return
                            }
                            
                            try {
                              user_event_id = "Aucune"
                              if(req.user){
                                db.selectAll("promos", {_id: req.user.promo_id}, {}, function(promo){
                                  if(promo.length > 0){user_event_id = promo[0].event_id}
                                  params["user_event_id"] = user_event_id
                                  framework = ejs.render(framework, params)
                                  res.send(framework)
                                  callback()
                                })
                              } else {
                                params["user_event_id"] = user_event_id
                                framework = ejs.render(framework, params)
                                res.send(framework)
                                callback()
                              }
                            } catch(e) {
                              res.status(500)
                              res.send(e)
                              callback()
                            }
                          } else {
                            res.send("FATAL ERROR")
                            callback()
                          }
                        }
                    })
                })
            }
        })
    })
}

function replaceAll(str,replaceWhat,replaceTo){
    var re = new RegExp(replaceWhat, 'g');
    return str.replace(re,replaceTo);
}

function generateAuthKey(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = {
    replaceAll,
    generateAuthKey
}