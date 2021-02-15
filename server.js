require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const signUp = require("./routesconfig/signupconfig");
const login = require("./routesconfig/loginconfig");
const otpAuth = require("./routesconfig/otpverification");
const app = express();
const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
} = require("./DB/DBconfig");
const generator = require("./config/config");
const { loginMailer } = require("./sendmail/sendmail");
const Transaction = require("./wallet/transactions");
const Blockchain = require("./blockchain/blockchain");
const { Wallet, sign, createTransaction } = require("./wallet/walletindex");
const { signUpMailer } = require("./sendmail/sendmail");
const singIn = require("./routesconfig/loginconfig");
//middleware

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//passport middleware

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//dbconnection
db();

//middleware
passport.use(userModel().createStrategy());

// serilize and deserilize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  userModel().findById(id, function (err, user) {
    done(err, user);
  });
});

//routes
// landing pg
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index", {
      authenticated: true,
    });
  } else {
    res.render("index", {
      authenticated: false,
    });
  }
});
//sign up
//get
app.get("/login", (req, res) => {
  res.render("signin");
});
//post
app.post("/login", (req, res) => {
  login(req, res);
});
//register
//get
app.get("/register", (req, res) => {
  res.render("signup");
});
//post
app.post("/register", (req, res) => {
  signUp(req, res);
});
//otp
//get
app.get("/otp", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("otp");
  } else {
    console.log("no entry");
  }
});
//post
app.post("/otp", (req, res) => {
  if (req.isAuthenticated()) {
    otpAuth(req, res);
  } else {
    console.log("not elligible");
  }
});

//dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    console.log("please log in or create an email");
    res.redirect("/login");
  }
});

//wallet creation
app.get("/wallet", (req, res) => {
  if (req.isAuthenticated()) {
    const userWallet = new Wallet();
    const signature = userWallet.sign(req.user);
    const wallet = {
      balance: userWallet.balance,
      keyPair: JSON.stringify(userWallet.keyPair),
      publicKey: userWallet.publicKey,
    };
    userModel().updateOne(
      { _id: req.user.id },
      { wallet: wallet, signature: signature },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("wallet and signature succefully created");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
});
//routes
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server live at port${port}`);
});
