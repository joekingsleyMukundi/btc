require('dotenv').config
const express = require ("express");
const app = express();
const mongoose = require('mongoose');
const{userSchema}=require("./scheama");
const {userModel} = require("./models")
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const useSession = ()=>{
 return( app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:false,
  }))
 )}

const initializePassport = ()=>{
  return app.use(passport.initialize())
 }
 const useSessionPassport=()=>{
 return app.use(passport.session());
 }
 
const serrilizeUser = ()=>{
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function (id, done) {
    userModel().findById(id, function (err, user) {
      done(err, user);
    });
  });
}

const strategy = ()=>{
  passport.use (userModel().createStrategy());
}

module.exports = {useSession,useSessionPassport,initializePassport,serrilizeUser,strategy}