const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectAll("promos", {_id: req.params.promotion_id}, {}, function(result){
          if(result.length > 0){
            res.status(200)
            res.send(result[0])
            res.end()
          } else {
            res.status(404)
            res.send([])
            res.end()
          }
        })      
    }
}