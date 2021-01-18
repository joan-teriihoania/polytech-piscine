const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(!req.params.creneau_id){
            res.status(404)
            res.end()
            return
        }

        db.selectAll("creneaux", {_id: req.params.creneau_id}, {}, function(creneaux){
          if(creneaux.length > 0){
            db.deleteOne("creneaux", {_id: req.params.creneau_id}, function(result){
              res.status(200)
              res.send("OK")
              res.end()
            })
          } else {
            res.status(404)
            res.end()
          }
        })
    }
}