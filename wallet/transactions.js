const uuid = require("uuid").v1;
const { verifySignature } = require("../util/elliptic");
const { Wallet } = require("./walletindex");
const hasher = require("../util/crypto_hash");
const { ec } = require("../util/elliptic");
class Transactions {
  constructor({ wallet, recipient, amount }, signature) {
    this.id = uuid();
    this.outPutMap = this.createOutPutMap({ wallet, recipient, amount });
    this.inputMap = this.createInputMap({ wallet }, this.outPutMap);
    this.signature = signature;
  }
  createOutPutMap({ wallet, recipient, amount, signature }) {
    let refCode = hasher(wallet, recipient, amount, signature);
    refCode = refCode.substr(0, 8);
    refCode = refCode.toUpperCase();
    const outPutMap = {
      refCode: refCode,
      recipient: recipient,
      amount: amount,
      senderWalletId: wallet.publicKey,
      senderWalletBalance: wallet.balance - amount,
    };
    return outPutMap;
  }
  createInputMap({ wallet }) {
    return {
      timestamp: Date.now(),
      amount: wallet.balance,
      address: wallet.publicKey,
    };
  }
  static validateTransactions(transaction) {
    const {
      input: { address, amount, signature },
      outPutMap,
    } = transaction;
    if (!verifySignature({ publicKey: address, data: outPutMap, signature })) {
      return false;
    }
    return true;
  }
}

const createTransaction = (wallet, recipient, amount, signature) => {
  return new Transactions(wallet, recipient, amount, signature);
};

// const wallet = new Wallet();
// const signo = wallet.sign();
// const recipient = "ygytrcr";
// const amount = 50;
// const transaction = createTransaction({ wallet, recipient, amount }, signo);
// console.log(transaction);
module.exports = { Transactions, createTransaction };
