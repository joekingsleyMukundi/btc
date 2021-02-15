const { initiator } = require("./miner");
const overSight = (coinsNeeded) => {
  for (let i = 1; i < coinsNeeded; i++) {
    setTimeout(function timer() {
      initiator(i);
      console.log(i);
    }, i * 60000);
  }
};

module.exports = { overSight };
