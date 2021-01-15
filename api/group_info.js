const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(!req.params.group_id){
            res.status(404)
            res.end()
            return
        }

        promise = []
        toreturn = []
        db.selectAll("groupes", {_id: req.params.group_id}, {}, function(groups){
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
            res.status(404)
            res.end()
          }
        })
    }
}