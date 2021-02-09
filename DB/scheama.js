const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  phone: String,
  otp:String,
  email: String,
  country:String,
  password: String,
  wallet:{
    balance:Number,
    keyPair:String,
    publicKey:String,
  },
  signature:{
    r:String,
    s:String,
    recoveryParam:Number,
  },
})

module.exports= {userSchema}