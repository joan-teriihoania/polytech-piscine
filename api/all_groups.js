const db = require('../db')

module.exports = {
    exec: function(req, res){
        promise = []
        toreturn = []
        db.selectAll("events", {}, {}, function(events){
          if(events.length > 0){
            for(const [key, event] of Object.entries(events)){
              promise.push(new Promise(function(resolve, reject){
                db.selectAll("groupes", {event_id: event._id.toString()}, {}, function(result){
                  for(const [key, content] of Object.entries(result)){
                    toreturn.push(content)
                  }
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
            res.status(404)
            res.end()
          }
        })
    }
}