const db = require('../db')

module.exports = {
    exec: function(req, res){
      if(req.params.creneau_id){
        db.selectAll("groupes", {_id: req.user.group_id}, {}, function(groups){
          if(groups.length > 0){
            db.selectAll("creneaux", {_id: req.params.creneau_id, group_id: req.user.group_id}, {}, function(creneaux){
              if(creneaux.length > 0){
                db.update("creneaux", {group_id: req.user.group_id}, {group_id: ""}, function(result){
                  db.update("creneaux", {_id: req.params.creneau_id}, {group_id: req.user.group_id}, function(result){
                    res.status(200)
                    res.send("OK")
                    res.end()
                  })
                })
              } else {
                res.status(403)
                res.end("Ce creneau est déjà occupé par un groupe")
              }
            })
          } else {
            res.status(400)
            res.end("Vous devez rejoindre ou créer un groupe pour réserver un créneau")
          }
        })
      } else {
        res.status(400)
        res.end("Créneau inconnu")
      }
    }
}