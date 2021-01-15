const fs = require('fs')

module.exports = {
    format: function(content, params, req, res, ressources, callback){
        fs.readdir('./public/img/403', function(err, files){
            if(!err && files.length > 0){
                params['random_403_img'] = files[Math.floor(Math.random() * files.length)]
            } else {
                params['random_403_img'] = ""
            }
            callback(content, params)
        })
    }
}