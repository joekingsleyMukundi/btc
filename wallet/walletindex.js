const Transactions = require('./transactions');
const{startingBalance} =  require('../blockchain/blockconfig')
const hasher = require("../util/crypto_hash");
const{ec} = require('../util/elliptic');
class Wallet{
  constructor(){
    this.balance = startingBalance;
    this.keyPair =  ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }
  sign(data){
    return this.keyPair.sign(hasher(data))
  }
}
// const signature= (wallet,data)=>{
//   return wallet.keyPair.sign(hasher(data))
// }
  const createTransaction=(wallet,recipient,amount)=>{
    if(amount>wallet.balance){
      console.log("error the amount is mor than balance");
    }
    return (new Transactions(wallet, recipient,amount))
  }
  
  module.exports = {Wallet,createTransaction}