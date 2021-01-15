const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectAll("users", {}, {}, function(users){
          if(users.length > 0){
            promise = []
            toreturn = []

            for(const [key, user] of Object.entries(users)){
              promise.push(new Promise(function(resolve, reject){
                db.selectOne("promos", {_id: user.promo_id}, {}, function(promo){
                  user['promo'] = promo
                  db.selectOne("groupes", {_id: user.group_id}, {}, function(group){
                    user['group'] = group
                    toreturn.push(user)
                    resolve()
                  })
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
            res.send(users)
            res.end()
          }
        })
    }
}