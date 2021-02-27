const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  minerCode: Number,
  phone: String,
  otp: String,
  email: String,
  country: String,
  password: String,
  wallet: {
    balance: Number,
    keyPair: String,
    publicKey: String,
  },
  signature: {
    r: String,
    s: String,
    recoveryParam: Number,
  },
  notifications: [String],
  nodeAcceptance: String,
});
const cstorageSchema = new mongoose.Schema({
  coins: [String],
});

const blockchainSchema = new mongoose.Schema({
  blockchain: {
    chain: [
      {
        index: Number,
        timestamp: Number,
        data: {
          transactions: [
            {
              id: String,
              transactions: String,
            },
          ],
        },
        lastHash: String,
        hash: String,
        nonce: Number,
        difficulty: Number,
      },
    ],
    transactionPool: [
      {
        id: String,
        transactions: {
          id: String,
          outPutMap: {
            refCode: String,
            recipient: String,
            amount: String,
            senderWalletId: String,
            senderWalletBalance: Number,
          },
          inputMap: {
            timestamp: String,
            amount: Number,
            address: String,
          },
          signature: {
            r: String,
            s: String,
            recoveryParam: Number,
          },
        },
      },
    ],
    networkNodes: [String],
    liveNodesUrl: [String],
  },
});
module.exports = { userSchema, cstorageSchema, blockchainSchema };
