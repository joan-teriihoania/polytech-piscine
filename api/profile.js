const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("../auth");
const models = require("../models");
const settings = require("../settings");


module.exports = {
  exec: function(req, res){
    if (req.body.newpassword1 != req.body.newpassword2)) {
        res.status(400)
        res.send("Les mots de passe ne correspondent pas.")
        return
    }
    if (!bcrypt.compareSync(req.body.oldpassword, user.password)) {
        res.status(400)
        res.send("Ancien mot de passe incorrect.")
        return
    }
    let hash = bcrypt.hashSync(req.body.newpassword2, settings.BCRYPT_WORK_FACTOR);
    models.User.findOneAndUpdate({ email: req.body.email }, {$set:{password:hash}}, (err) => {
      if(err){
        res.status(400)
        res.send("Une erreur inconnue s'est produite. Veuillez retenter.")
      }
      res.status(200);
      res.send("OK");
    });
  }
}