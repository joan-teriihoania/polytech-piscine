const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectAll("events", {}, {}, function(result){
          res.status(200)
          res.send(result)
          res.end()
        })      
    }
}