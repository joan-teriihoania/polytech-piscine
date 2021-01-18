const db = require('../db')

module.exports = {
    exec: function(req, res){
      data = req.body
      data['event_id'] = req.params.event_id
      console.log(data)
      db.insert("creneaux", data)
      res.send("OK")
    }
}