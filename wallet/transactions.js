const uuid = require("uuid").v1
const {verifySignature} = require("../util/elliptic");
const {Wallet} =require('./walletindex')
const hasher = require("../util/crypto_hash");
const{ec} = require('../util/elliptic');
class Transactions {
  constructor({wallet,recipient,amount},signature){
    this.id = uuid();
    this.outPutMap = this.createOutPutMap({wallet,recipient,amount});
    this.inputMap =  this.createInputMap({wallet},this.outPutMap);
    this.signature = signature
  }
  createOutPutMap ({wallet,recipient,amount}){
    const outPutMap ={}
    outPutMap[recipient]= amount;
    outPutMap[wallet.publicKey] = wallet.balance-amount
    return outPutMap
  }
  createInputMap({wallet}){
    return {
      timestamp:Date.now(),
      amount:wallet.balance,
      address:wallet.publicKey,
    }
  }
  static validateTransactions(transaction){
    const {input:{address,amount, signature},outPutMap}=transaction
    if(!verifySignature({publicKey:address,data: outPutMap,signature})){
      return false
    }
    return true
  }
}

module.exports= Transactions