const db = require('../db')

module.exports = {
    exec: function(req, res){
        if(!req.params.group_id){
            res.status(404)
            res.end()
            return
        }

        db.selectAll("groupes", {_id: req.params.group_id}, {}, function(groups){
          if(groups.length > 0){
            db.deleteOne("groupes", {_id: req.params.group_id}, function(result){
              res.status(200)
              res.send("OK")
              res.end()
            })
          } else {
            res.status(404)
            res.end()
          }
        })
    }
}