const fs = require('fs')
const db = require('../../db')

module.exports = {
    format: function(content, params, req, res, ressources, callback){
      if(req.user){
        res.redirect('/')
        return
      }
      
      params['csrfToken'] = req.csrfToken()
      db.selectAll("promos", {}, {}, function(promos){
        params["promos"] = promos
        callback(content, params)
      })
    }
}
// attendre l'API pour le post