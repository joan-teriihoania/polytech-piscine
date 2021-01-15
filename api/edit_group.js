const db = require('../db')

module.exports = {
    exec: function(req, res){
      if(req.params.group_id){
          db.selectAll("groupes", {_id: req.params.group_id}, {}, function(groups){
            if(groups.length > 0){
              db.selectAll("users", {group_id: req.params.group_id, _id: req.user._id.toString()}, {}, function(users){
                if(users.length > 0 || req.user.isAdmin){
                  db.update("groupes", {_id: req.params.group_id}, req.body, function(result){
                    res.status(200)
                    res.send("OK")
                    res.end()
                  })
                }
              })
            } else {
              res.status(404)
              res.end()
            }
          })
        } else {
          res.status(400)
          res.end()
        }
    }
}