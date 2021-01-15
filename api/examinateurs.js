const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectAll("examinateurs", {}, {}, function(examinateurs){
          res.status(200)
          res.send(examinateurs)
          res.end()
        })
    }
}