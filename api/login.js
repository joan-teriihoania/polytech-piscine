const bcrypt = require("bcryptjs");
const express = require("express");
const auth = require("../auth");
const models = require("../models");
const settings = require("../settings");

module.exports = {
    exec: function(req, res){
      models.User.findOne({ email: req.body.email }, "firstName lastName email password promo_id", (err, user) => {
      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.status(400)
        res.send("Email ou mot de passe incorrect.")
        return
      }

      auth.createUserSession(req, res, user);
      console.log(user)
      res.status(200);
      res.send("OK");
    });
    }
}