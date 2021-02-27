const { startingBalance } = require("../blockchain/blockconfig");
const hasher = require("../util/crypto_hash");
const { ec } = require("../util/elliptic");
const { Transactions, createTransaction } = require("./transactions");
const Blockchain = require("../blockchain/blockchain");
class Wallet {
  constructor() {
    this.balance = startingBalance;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }
  sign(data) {
    return this.keyPair.sign(hasher(data));
  }
}
// const signature= (wallet,data)=>{
//   return wallet.keyPair.sign(hasher(data))
//

// const wallet = new Wallet();
// const sign = wallet.sign;
// const recipient = "ygytrcr";
// const amount = 50;
// const transaction = new Transactions({ wallet, recipient, amount }, sign);
// console.log(transaction);
module.exports = { Wallet, createTransaction };
