const db = require('../db')

module.exports = {
    exec: function(req, res){
      if(!req.body.jury){
        req.body.jury = []
      } else {
        req.body.jury = JSON.parse(req.body.jury)
        for(const [i, member] of Object.entries(req.body.jury)){
          req.body.jury[i]["creneau_id"] = req.params.creneau_id
        }
      }

      if(req.params.creneau_id){
          db.deleteMany("examiner", {creneau_id: req.params.creneau_id}, function(examiner){
            if(req.body.jury.length > 0){
              db.insertMany("examiner", req.body.jury)
            }
            res.status(200)
            res.send("OK")
            res.end()
          })
        } else {
          res.status(400)
          res.end()
        }
    }
}