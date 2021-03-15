const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
} = require("../DB/DBconfig");
const { generator, UNIQID } = require("../config/config");
const timer = require("../config/timeGet");
const { signUpMailer } = require("../sendmail/sendmail");

const signUp = (req, res) => {
  let otp = generator();
  let uniqId = UNIQID();
  let currentTime = timer();
  userModel().register(
    {
      username: req.body.username,
      uniqueId: uniqId,
      email: req.body.email,
      otp: otp.otp,
      emailstatus: "not verified",
      country: req.body.country,
      nodeAcceptance: "0",
      notifications: {
        msg: "Account created succefully",
        time: currentTime,
      },
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        signUpMailer(req.body.email, req.body.username, otp.otp);
        passport.authenticate("local")(req, res, () => {
          console.log("welcome lets Go!");
          res.redirect("/otp");
        });
      }
    }
  );
};

module.exports = signUp;
