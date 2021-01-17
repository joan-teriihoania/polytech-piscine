const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("../auth");
const models = require("../models");
const settings = require("../settings");

module.exports = {
  exec: function(req, res){
    if(req.body.password != req.body.password_confirm){
      res.status(400)
      res.send("Les mots de passe ne correspondent pas")
      return
    }

    let hash = bcrypt.hashSync(req.body.password, settings.BCRYPT_WORK_FACTOR);
    req.body.password = hash;
    let user = new models.User(req.body);

    if(!req.body.email.endsWith('@etu.umontpellier.fr')){
      res.status(400)
      res.send("Votre mail doit terminer par @etu.umontpellier.fr")
      return
    }

    user.save((err) => {
      if (err) {
        error = "Une erreur inconnue s'est produite. Veuillez retenter."

        if (err.code === 11000) {
          error = "Cette adresse mail est déjà prise.";
        }

        res.status(401)
        res.send(error)
        return
      }

      auth.createUserSession(req, res, user);
      res.status(200);
      res.send("OK");
    });
  }
}