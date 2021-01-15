const db = require('../../db')

module.exports = {
    format: function(content, params, req, res, ressources, callback){
      if(!req.user){res.redirect('/');return}

      db.selectOne("promos", {_id: req.user.promo_id}, {}, function(promo){
        if(promo){
          db.selectAll("groupes", {}, {}, function(groups){
            if(promo.event_id){
              params["user_event_id"] = promo.event_id
            } else {
              params["user_event_id"] = "Aucune"
            }

            toreturn = []
            promise = []
            params["groups"] = []
            
            for(const [key, group] of Object.entries(groups)){
              promise.push(new Promise(function(resolve, reject){
                db.selectAll("users", {group_id: group._id.toString()}, {}, function(users){
                  group['members'] = users
                  params["groups"].push(group)
                  resolve()
                })
              }))
            }

            Promise.all(promise).then(() => {
              callback(content, params)
            })
          })
        }
      })
    }
}

