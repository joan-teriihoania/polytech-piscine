const db = require('../db')

module.exports = {
    exec: function(req, res){
      if(req.params.creneau_id){
        db.selectAll("groupes", {_id: req.user.group_id}, {}, function(groups_check){
          db.selectAll("groupes", {}, {}, function(groups){
            if(groups_check.length > 0){
            groups_id = groups.map((group) => {return group._id.toString()})
              db.selectAll("creneaux", {}, {}, function(b_creneaux){
                creneaux = []
                for(const [i, creneau] of Object.entries(b_creneaux)){
                  if(creneau._id.toString() == req.params.creneau_id){
                    if(!groups_id.includes(creneau.group_id) && creneau.group_id != req.user.group_id){
                      creneaux.push(creneau)
                    }
                  }
                }

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
                  res.end("Ce creneau est déjà occupé par un groupe ou n'existe pas")
                }
              })
            } else {
              res.status(400)
              res.end("Vous devez rejoindre ou créer un groupe pour réserver un créneau")
            }
          })
        })
      } else {
        res.status(400)
        res.end("Créneau inconnu")
      }
    }
}