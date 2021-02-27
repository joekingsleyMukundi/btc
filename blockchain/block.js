const { GENESIS_BLOCK } = require("./blockconfig");
const hasher = require("../util/crypto_hash");
class Block {
  constructor({
    index,
    timestamp,
    transactions,
    lastHash,
    hash,
    nonce,
    difficulty,
  }) {
    (this.index = index),
      (this.timestamp = timestamp),
      (this.data = { transactions }),
      (this.lastHash = lastHash),
      (this.hash = hash);
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  // proofOfWork(difficulty) {
  //   while (
  //     this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
  //   ) {
  //     this.nonce = this.nonce + 1;
  //     this.hash = hasher(this.timestamp, this.data, this.lastHash, this.nonce);
  //   }
  // }
  static genesis() {
    return new this(GENESIS_BLOCK);
  }
  static generatedBlock({ lastBlock, index, transactions }) {
    let hash, timestamp;
    // const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const difficulty = 6;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      hash = hasher(
        index,
        timestamp,
        lastHash,
        transactions,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));
    return new this({
      index,
      timestamp,
      transactions,
      lastHash,
      difficulty,
      nonce,
      hash,
    });
  }
}
module.exports = Block;
