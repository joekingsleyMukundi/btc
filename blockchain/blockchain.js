require('dotenv').config()
const Block = require("./block");
const hasher =  require("../util/crypto_hash")
class Blockchain {
  constructor(){
    this.chain = [Block.genesis()]
  }
  addBlock(data){
    const newBlock =  Block.generatedBlock({
      lastBlock: this.chain[this.chain.length-1],
      data:data
    })
    this.chain.push(newBlock);
  }


  replaceChain(chain){
    if(chain.length<=this.chain.length){
      return;
    }
    if(!Blockchain.isValidChain(chain)){
      return;
    }
    
    this.chain=chain;
  }



  static isValidChain(chain){
    if (JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())){
      return false;
    }
    for(let i=1; i<chain.length; i++){
      const Block = chain[i];

      const actualLastHash =  chain[i-1];

      const{timestamp,lastHash,hash,data,nonce,difficulty} = Block
      if(lastHash!==actualLastHash)return false

      const validatedHash = hasher(timestamp,lastHash,data,nonce,difficulty);

      if (hash !== validatedHash)return false;
    }
    return true;
  }
}
module.exports = Blockchain;
