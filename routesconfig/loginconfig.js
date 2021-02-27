const express = require("express");
const bodyParser = require("body-parser");
const { passport, userModel } = require("../DB/DBconfig");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const login = (req, res) => {
  const User = userModel();
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        User.findById({ _id: req.user.id }, (err, foundUser) => {
          if (!foundUser.wallet || !foundUser.signature) {
            console.log("please create a wallet ");
          } else if (err) {
            console.log(err);
          } else {
            console.log("success");
            res.redirect("/");
          }
        });
      });
    }
  });
};

module.exports = login;
