const mongoose = require('mongoose');
const{userSchema,cstorageSchema}=require("./scheama");

const userModel = ()=>{
 const User = new mongoose.model("User", userSchema);
 return ( User)
}
const cstorageModel = ()=>{
  const Cstorage = new mongoose.model("CStorage",cstorageSchema)
  return (Cstorage)
}

module.exports ={userModel,cstorageModel}