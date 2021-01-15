const db = require('../db')

module.exports = {
    exec: function(req, res){
      if(req.params.creneau_id){
          db.selectAll("creneaux", {_id: req.params.creneau_id}, {}, function(creneaux){
            if(creneaux.length > 0){
              db.update("creneaux", {_id: req.params.creneau_id}, req.body, function(result){
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