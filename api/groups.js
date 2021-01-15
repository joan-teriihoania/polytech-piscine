const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(req.params.event_id){
          db.selectAll("events", {_id: req.params.event_id}, {}, function(events){
            if(events.length > 0){
              db.selectAll("groupes", {event_id: req.params.event_id}, {}, function(groups){
                promise = []
                toreturn = []
                if(groups.length > 0){
                  for(const [key, group] of Object.entries(groups)){
                    promise.push(new Promise(function(resolve, reject){
                      db.selectAll("users", {group_id: group._id.toString()}, {}, function(members){
                        group['members'] = members
                        toreturn.push(group)
                        resolve()
                      })
                    }))
                  }
                  
                  Promise.all(promise).then(() => {
                      res.status(200)
                      res.send(toreturn)
                      res.end()
                  })
                } else {
                  res.status(200)
                  res.send(groups)
                }
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