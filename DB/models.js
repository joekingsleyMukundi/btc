const mongoose = require('mongoose');
const{userSchema}=require("./scheama");

const userModel = ()=>{
 const User = new mongoose.model("User", userSchema);
 return ( User)
}


module.exports ={userModel}