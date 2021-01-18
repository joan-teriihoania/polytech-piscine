const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(!req.params.event_id){
            res.status(404)
            res.end()
            return
        }

        promise = []

        db.deleteOne("events", {_id: req.params.event_id}, function(result){
          db.selectAll("creneaux", {event_id: req.params.event_id}, {}, function(creneaux){
            if(creneaux.length > 0){
              for(const [i, creneau] of Object.entries(creneaux)){
                promise.push(new Promise(function(resolve, reject){
                  db.deleteOne("creneaux", {_id: creneau._id.toString()}, function(result){
                    db.deleteOne("groupes", {_id: creneau.group_id}, function(result){
                      resolve()
                    })
                  })
                }))
              }
              
              Promise.all(promise).then(() => {
                res.status(200)
                res.send("OK")
                res.end()
              })
            } else {
              res.status(200)
              res.send("OK")
              res.end()
            }
          })
        })
    }
}