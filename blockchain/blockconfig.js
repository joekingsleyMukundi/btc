require("dotenv").config();
const hasher = require("../util/crypto_hash");
const INITIAL_DIFFICULTY = 4;
const GENESIS_BLOCK = {
  index: 1,
  timestamp: Date.now(),
  lastHash: process.env.LASTHASH,
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  hash: hasher(Date.now(), process.env.LASTHASH),
};

const startingBalance = 0;
module.exports = { GENESIS_BLOCK, startingBalance };
