const fs = require('fs')

module.exports = {
    format: function(content, params, req, res, ressources, callback){
      if (req.session) {
        req.session.reset();
      }
      res.redirect("/");
    }
}