const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(req.body.user_id){
            db.selectAll("users", {_id: req.body.user_id}, {}, function(users){
              if(users){ // si utilisateur existe
                db.update("users", {_id: req.body.user_id}, {group_id: req.params.group_id}, function(result){
                  res.status(200)
                  res.send("OK")
                  res.end()
                })
              } else {
                res.status(404)
                res.end()
              }
            })
        } else {
          res.status(400)
          res.end()
        }
    }
}