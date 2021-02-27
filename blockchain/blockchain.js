require("dotenv").config();
const Block = require("./block");
const hasher = require("../util/crypto_hash");
class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
    this.transactionPool = [];
    this.currentNodeUrl;
    this.networkNodes = [];
  }

  setTransaction(transaction) {
    const newTransaction = {
      id: transaction.id,
      transactions: transaction,
    };
    this.transactionPool.push(newTransaction);
  }
  getCurrentNode(nodeUrl) {
    this.currentNodeUrl = nodeUrl;
  }

  addBlock(data) {
    const newBlock = Block.generatedBlock({
      lastBlock: this.chain[this.chain.length - 1],
      index: this.chain.length + 1,
      data: data,
    });
    this.transactionPool = [];
    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      return;
    }

    this.chain = chain;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const Block = chain[i];

      const actualLastHash = chain[i - 1];

      const {
        index,
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
      } = Block;
      if (lastHash !== actualLastHash) return false;

      const validatedHash = hasher(
        index,
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validatedHash) return false;
    }
    return true;
  }
}
// const block = new Blockchain();
// const tra = {
//   id: 0,
//   amount: 10,
//   hash: "byufttrdrdrtxrtdrt",
// };
// block.setTransaction(tra);
// block.addBlock(tra);
// console.log(block);
module.exports = Blockchain;
