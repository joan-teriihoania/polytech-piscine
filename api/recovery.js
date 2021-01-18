const bcrypt = require("bcryptjs");
const auth = require("../auth");
const models = require("../models");
const settings = require("../settings");
const db = require("../db");
const nodemailer = require('nodemailer');
const generator = require('generate-password')

module.exports = {
  exec: function(req, res){
    var password = generator.generate({
      length: 16,
      numbers: true,
      symbols: true
    });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'polytechpiscine@gmail.com',
        pass: '[SpMn~DAS)t?}3@p'
      }
    });

    var mailOptions = {
      from: 'polytechpiscine@gmail.com',
      to: req.body.email,
      subject: 'Mot de passe oublié',
      text: 'Voici votre mot de passe temporaire : ' + password
    };

    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        res.status(400)
        res.send("L'envoi de mail a échoué.")
      }
    });
    let hash = bcrypt.hashSync(password, settings.BCRYPT_WORK_FACTOR);
    models.User.findOneAndUpdate({ email: req.body.email }, {$set:{password:hash}}, (err) => {
      if(err){
        res.status(400)
        res.send("L'email spécifié ne correspond à aucun compte.")
      }        
    });
    res.status(200);
    res.send("OK");
  }
}