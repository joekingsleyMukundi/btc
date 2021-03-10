require("dotenv").config;
const express = require("express");
const mongoose = require("mongoose");
const { userSchema, cstorageSchema } = require("./scheama");
const { userModel, cstorageModel, blockchainModel } = require("./models");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const db = () => {
  const mongoDB =
    "mongodb+srv://admin-joe:Mukundijoe254@cluster0.by3q3.mongodb.net/meitnerium";
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });
  const db = mongoose.connection;
  if (db) {
    console.log("success");
  } else {
    console.log("error");
  }
  mongoose.set("useCreateIndex", true);

  userSchema.plugin(passportLocalMongoose);
};

module.exports = {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  cstorageModel,
  blockchainModel,
};
