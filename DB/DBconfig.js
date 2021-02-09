require('dotenv').config
const express = require ("express");
const mongoose = require('mongoose');
const{userSchema}=require("./scheama");
const {userModel} = require("./models")
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const db = ()=>{
  const mongoDB = 'mongodb://localhost:27017/meitnerium';
  mongoose.connect(mongoDB, { useNewUrlParser: true ,useUnifiedTopology: true});
  const db = mongoose.connection;
  if (db){
    console.log('success');
  }else {
    console.log('error')
  }
  mongoose.set("useCreateIndex", true);

  userSchema.plugin(passportLocalMongoose);
}

module.exports = {db,session,passport,passportLocalMongoose,userModel};