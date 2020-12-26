const { encrypt } = require('../crypto');
const db = require('../db');
const googleutils = require('../googleutils');
const { database, generateAuthKey } = require('../server');

module.exports = {
    exec: function(req, res){
        var email = req.query.email
        var password = req.query.password
        var code = req.query.code
        if(email != undefined && password != undefined){
            db.select(database, 'SELECT * FROM users WHERE email = "'+email+'" AND password = "'+password+'"', function(rows){
                if(rows && rows.length > 0){
                    res.cookie("JZ-Translation-auth", encrypt(JSON.stringify({
                        "auth_key": rows[0].auth_key
                    })))

                    res.status(200)
                    res.send(rows[0])
                    return
                } else {
                    db.select(database, 'SELECT * FROM users WHERE auth_google = "true" AND email = "'+email+'"', function(rows){
                        if(rows && rows.length > 0){
                            res.status(401)
                            res.send("Cette adresse mail utilise un compte Google.")
                        } else {
                            res.status(401)
                            res.send("Identifiants incorrectes")
                        }
                        return
                    })
                }
            })
        } else {
            res.status(401)
            res.send("Vous n'avez pas renseigné d'identifiants")
            return
        }
    }
}