const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(req.params.user_id){
            if((req.user && req.params.user_id != req.user._id) || (req.user && req.user.isAdmin)){
              db.selectAll("users", {_id: req.params.user_id}, {}, function(users){
                if(users.length > 0){
                  db.update("users", {_id: req.params.user_id}, req.body, function(result){
                    res.status(200)
                    res.send("OK")
                    res.end()
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