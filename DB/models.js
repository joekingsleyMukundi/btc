const mongoose = require("mongoose");
const { userSchema, cstorageSchema, blockchainSchema } = require("./scheama");

const userModel = () => {
  const User = new mongoose.model("User", userSchema);
  return User;
};
const cstorageModel = () => {
  const Cstorage = new mongoose.model("CStorage", cstorageSchema);
  return Cstorage;
};
const blockchainModel = () => {
  const Blockchain = new mongoose.model("Blockchain", blockchainSchema);
  return Blockchain;
};

module.exports = { userModel, cstorageModel, blockchainModel };
