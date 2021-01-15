const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(req.params.user_id){
            if((req.user && req.params.user_id != req.user._id) || req.query.auth_key != process.env.SECRET_KEY || req.body.auth_key != process.env.SECRET_KEY){
              db.selectAll("users", {_id: req.params.user_id}, {}, function(users){
                if(users.length > 0){
                  db.selectOne("promos", {_id: users[0].promo_id}, {}, function(promo){
                    users[0]['promo'] = promo
                    db.selectOne("groupes", {_id: users[0].group_id}, {}, function(group){
                      users[0]['group'] = group
                      res.status(200)
                      res.send(users[0])
                    })
                  })
                } else {
                  res.status(404)
                  res.end()
                }
              })
            } else {
              res.status(403)
              res.end()
            }
        } else {
          res.status(400)
          res.end()
        }
    }
}