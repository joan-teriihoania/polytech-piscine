const db = require('../db')

module.exports = {
    exec: function(req, res){
      db.insert("events", req.body)
      res.send("OK")
    }
}