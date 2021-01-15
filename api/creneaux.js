const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(req.params.event_id){
          db.selectAll("events", {_id: req.params.event_id}, {}, function(events){
            if(events.length > 0){
              db.selectAll("creneaux", {event_id: req.params.event_id}, {}, function(creneaux){
                toreturn = []
                promise = []

                for(const [key, creneau] of Object.entries(creneaux)){
                  promise.push(new Promise(function(resolve, reject){
                    db.selectAll("groupes", {_id: creneau.group_id}, {}, function(group){
                      creneau['group'] = group
                      db.selectAll("examiner", {creneau_id: creneau._id.toString()}, {}, function(examiner){                    
                        b_promise = []
                        if(examiner.length > 0){
                          for(const [key, examiner_] of Object.entries(examiner)){
                            b_promise.push(new Promise(function(resolve, reject){
                              db.selectAll("examinateurs", {_id: examiner_.examinateur_id}, {}, function(examinateurs){
                                  creneau["jury"] = examinateurs
                                  toreturn.push(creneau)
                                  resolve()
                              })
                            }))
                          }
                        } else {
                          toreturn.push(creneau)
                          resolve()
                        }

                        Promise.all(b_promise).then(() => {
                          resolve()
                        })
                      })
                    })
                  }))
                }
                
                Promise.all(promise).then(() => {
                  res.status(200)
                  res.send(toreturn)
                  res.end()
                })
                
              })
            } else {
              res.status(404)
              res.end()
            }
          })
        } else {
          res.status(404)
          res.end()
        }
    }
}