const fs = require('fs')

module.exports = {
    format: function(content, params, req, res, ressources, callback){
      if(req.user){
        res.redirect('/profile')
        return
      }
      
      params['csrfToken'] = req.csrfToken()
      callback(content, params)
    }
}


