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
            console.log(testCoin);
            let difficulty;
            testCoin.coinChain.forEach((cointest) => {
              const cointestValue = cointest.value;
              const coinTestTimestamp = cointestValue.timestamp;
              const coinTestDifficulty = cointestValue.difficulty;
              const timeDiffrence = coinTestTimestamp - PreviousCoinTimestamp;
              if (timeDiffrence < mineRate) {
                difficulty = coinTestDifficulty + 1;
                if (difficulty < 5) return 5;
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
                console.log(minedCoin.coinChain);
              } else if (timeDiffrence > mineRate) {
                difficulty = coinTestDifficulty - 1;
                if (difficulty < 5) return 5;
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
                console.log(minedCoin.coinChain);
              } else if (timeDiffrence == mineRate) {
                if (difficulty < 5) return 5;
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
                console.log(minedCoin.coinChain);
              }
            });
          });
        });
      });
      length++;
    }
    cstorageModel().find({}, (err, foundArrys) => {
      foundArrys.forEach((foundArry) => {
        console.log(foundArry.coins.length);
      });
    });
  });
});

cstorageModel().find({}, (err, foundcoins) => {
  if (foundcoins.length === 0) {
    const Cstorage = cstorageModel();
    const coin = new Cstorage({
      coins: JSON.stringify(gen()),
    });
    coin.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("added the 1st coin lets add some more");
        miner(deficit - 1);
      }
    });
  } else {
    console.log(
      "there are some coins still in the bank so we will add some more"
    );
    miner(deficit);
  }
});
