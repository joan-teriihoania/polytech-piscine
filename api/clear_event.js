const db = require('../db')

module.exports = {
    exec: function(req, res){

        db.deleteMany("creneaux", {event_id: req.params.event_id}, function(result){
          res.status(200)
          res.send("OK")
          res.end()
        })
    }
}