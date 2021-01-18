const db = require('../db')

module.exports = {
    exec: function(req, res){
        db.selectAll("groupes", {}, {}, function(result){
            res.status(200)
            res.send(result)
            res.end()
        })
    }
}