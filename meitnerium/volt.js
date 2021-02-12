const Meitnerium = require("./coin");

class meitBank {
  constructor() {
    this.coinChain = [];
  }
  addCoin(difficulty) {
    const meit = Meitnerium.mineCoins(difficulty);
    const sign = meit.sign();
    const coin = {
      value: meit,
      signature: sign,
    };
    this.coinChain.push(coin);
  }
}
module.exports = meitBank;
