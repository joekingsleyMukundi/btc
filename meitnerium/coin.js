require("dotenv").config();
const uuid = require("uuid").v1;
const { ec } = require("../util/elliptic");
const hasher = require("../util/crypto_hash");

class Meitnerium {
  constructor({ timestamp, hash, nonce, difficulty }) {
    this.id = uuid();
    this.keyPair = ec.genKeyPair();
    this.hashKey = hasher(this.keyPair.getPublic().encode("hex"));
    this.hashId = hasher(this.id);
    this.value = 100;
    this.timestamp = timestamp;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static mineCoins(diffratio) {
    let timestamp, hash;
    const difficulty = diffratio;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      hash = hasher(timestamp, difficulty, nonce);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));
    return new this({ timestamp, difficulty, nonce, hash });
  }

  sign() {
    return this.keyPair.sign();
  }
}
module.exports = Meitnerium;
