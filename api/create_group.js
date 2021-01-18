const db = require('../db')

module.exports = {
    exec: function(req, res){
      db.insert("groupes", req.body).then((result) => {
        res.status(200)
        res.send({_id: result.insertedId})
      })
    }
}