require('dotenv').config();
const hasher = require("../util/crypto_hash");
const INITIAL_DIFFICULTY = 7;
const GENESIS_BLOCK={
  timestamp:Date.now(),
  lastHash:process.env.LASTHASH,
  data:[],
  difficulty:INITIAL_DIFFICULTY,
  nonce:0,
  hash:hasher(Date.now(),process.env.LASTHASH)
}

const startingBalance = 1000
module.exports = {GENESIS_BLOCK,startingBalance}