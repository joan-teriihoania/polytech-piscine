const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectOne("events", {_id: req.params.event_id}, {}, function(result){
          res.status(200)
          res.send(result)
          res.end()
        })
    }
}