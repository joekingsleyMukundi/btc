require("dotenv").config();
const Bank = require("./volt");
const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  cstorageModel,
} = require("../DB/DBconfig");
const mineRate = process.env.MINERATE;
db();
const gen = (difficulty) => {
  const coin = new Bank();
  coin.addCoin(difficulty);
  return coin;
};
const miner = (deficit) => {
  cstorageModel().find({}, (err, foundArrys) => {
    foundArrys.forEach((foundArry) => {
      const coins = foundArry.coins;
      let length = coins.length;
      while (deficit > length) {
        cstorageModel().find({}, (err, foundArrys) => {
          foundArrys.forEach((foundArry) => {
            const coins = foundArry.coins;
            const len = coins.length;
            const previousCoinChain = JSON.parse(coins[len - 1]);
            const previousCoinsArry = previousCoinChain.coinChain;
            previousCoinsArry.forEach((previousCoin) => {
              const PreviousCoinValue = previousCoin.value;
              const PreviousCoinTimestamp = PreviousCoinValue.timestamp;
              const coinDifficulty = PreviousCoinValue.difficulty;
              const testCoin = gen(coinDifficulty);
              let difficulty;
              testCoin.coinChain.forEach((cointest) => {
                const cointestValue = cointest.value;
                const coinTestTimestamp = cointestValue.timestamp;
                const coinTestDifficulty = cointestValue.difficulty;
                const timeDiffrence = coinTestTimestamp - PreviousCoinTimestamp;
                if (timeDiffrence < mineRate) {
                  difficulty = coinTestDifficulty + 1;
                  if (difficulty < 4) {
                    difficulty = 4;
                    const minedCoin = gen(difficulty);
                    console.log("1 " + minedCoin);
                    cstorageModel().update(
                      {},
                      { $push: { coins: JSON.stringify(minedCoin) } },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("done");
                        }
                      }
                    );
                  } else {
                    const minedCoin = gen(difficulty);
                    console.log("2 " + minedCoin);
                    cstorageModel().update(
                      {},
                      { $push: { coins: JSON.stringify(minedCoin) } },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("done");
                        }
                      }
                    );
                  }
                } else if (timeDiffrence > mineRate) {
                  difficulty = coinTestDifficulty - 1;
                  if (difficulty < 4) {
                    difficulty = 4;
                    const minedCoin = gen(difficulty);
                    cstorageModel().update(
                      {},
                      { $push: { coins: JSON.stringify(minedCoin) } },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("done");
                        }
                      }
                    );
                  } else {
                    const minedCoin = gen(difficulty);
                    cstorageModel().update(
                      {},
                      { $push: { coins: JSON.stringify(minedCoin) } },
                      (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("done");
                        }
                      }
                    );
                  }
                }
              });
            });
          });
        });
        length++;
      }
    });
  });
};

const initiator = (deficit) => {
  cstorageModel().find({}, (err, foundcoins) => {
    if (foundcoins.length === 0) {
      const Cstorage = cstorageModel();
      const coin = new Cstorage({
        coins: JSON.stringify(gen(process.env.INITIALVALUE)),
        value: 0.05,
      });
      coin.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added the 1st coin lets add some more");
        }
      });
    } else {
      cstorageModel().find({}, (err, foundArrys) => {
        foundArrys.forEach((foundArry) => {
          console.log(foundArry.coins.length);
          if (foundArry.coins.length < deficit) {
            miner(deficit);
          } else if (foundArry.coins.length >= deficit) {
            console.log("mined all coins");
          }
        });
      });
    }
  });
};

const overSight = (coinsNeeded) => {
  for (let i = 1; i < coinsNeeded; i++) {
    setTimeout(function timer() {
      initiator(i);
    }, i * 10000);
  }
};

module.exports = { overSight };
