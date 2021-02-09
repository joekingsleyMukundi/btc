const{GENESIS_BLOCK}= require("./blockconfig");
const hasher =  require("../util/crypto_hash")
class Block {
  constructor({timestamp,data,lastHash,hash,nonce,difficulty}){
    this.timestamp = timestamp,
    this.data = data,
    this.lastHash = lastHash,
    this.hash = hash
    this.nonce =  nonce;
    this.difficulty = difficulty
  }

  proofOfWork(difficulty){
    while(this.hash.substring(0,difficulty)!==Array(difficulty + 1).join("0")){
      this.nonce = this.nonce+1;
      this.hash = hasher(this.timestamp,this.data,this.lastHash,this.nonce)
    }
  }
  static genesis(){
    return(new this(GENESIS_BLOCK))
  }
  static generatedBlock({lastBlock,data}){
    let hash, timestamp
    // const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const {difficulty}= lastBlock;
    let nonce=0

    do{
      nonce++;
      timestamp = Date.now();
      hash=hasher(timestamp,lastHash,data,nonce,difficulty);
    }while(hash.substring(0,difficulty)!=="0".repeat(difficulty))
    return(new this ({timestamp,data,lastHash, difficulty, nonce ,hash}))
  }

}
module.exports = Block;
