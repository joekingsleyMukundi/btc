const { transformAuthInfo } = require("passport");
const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  blockchainModel,
  cstorageModel,
} = require("../DB/DBconfig");
db();

const getCoinValue = () => {
  const Minerate = 5;
  let userscount;
  let coindiff;
  const USdAvgValue = 100;
  let transactionsCount;
  userModel().count({}, (err, count) => {
    if (!err) {
      if (count !== 0) {
        userscount = count;
        cstorageModel().find({}, (err, foundCoins) => {
          if (foundCoins.length === 0) {
            coindiff = 5;
            blockchainModel().find({}, (err, foundchain) => {
              foundchain.forEach((chain) => {
                transactionsCount = chain.totalTransactions;
              });
              const value =
                (userscount / 2 + transactionsCount / 2) /
                (Minerate + coindiff);
              console.log(`first value is ${value}`);
              cstorageModel().update({}, { value: value }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`succes`);
                }
              });
            });
          } else {
            foundCoins.forEach((coins) => {
              const coinsAc = coins.coins;
              coinsAc.forEach((coinstr) => {
                const coinOBJ = JSON.parse(coinstr);
                const len = coinOBJ.coinChain.length;
                let i;
                for (i = 0; i < len; i++) {
                  const lastCoin = coinOBJ.coinChain[i];
                  coindiff = lastCoin.value.difficulty;
                }
              });
            });
            blockchainModel().find({}, (err, foundchain) => {
              foundchain.forEach((chain) => {
                transactionsCount = chain.totalTransactions;
              });
              const value =
                (userscount / 2 + transactionsCount / 2) /
                (Minerate + coindiff);
              console.log(`second value is ${value}`);
              cstorageModel().update({}, { value: value }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`succes`);
                }
              });
            });
          }
        });
      } else {
        userscount = 1;
        cstorageModel().find({}, (err, foundCoins) => {
          if (foundCoins.length === 0) {
            coindiff = 5;
            blockchainModel().find({}, (err, foundchain) => {
              foundchain.forEach((chain) => {
                transactionsCount = chain.totalTransactions;
              });
              const value =
                (userscount / 2 + transactionsCount / 2) /
                (Minerate + coindiff);
              console.log(`third value is ${value}`);
              cstorageModel().update({}, { value: value }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`succes`);
                }
              });
            });
          } else {
            foundCoins.forEach((coins) => {
              const coinsAc = coins.coins;
              coinsAc.forEach((coinstr) => {
                const coinOBJ = JSON.parse(coinstr);
                const len = coinOBJ.coinChain.length;
                let i;
                for (i = 0; i < len; i++) {
                  const lastCoin = coinOBJ.coinChain[i];
                  coindiff = lastCoin.value.difficulty;
                }
              });
            });
            blockchainModel().find({}, (err, foundchain) => {
              foundchain.forEach((chain) => {
                transactionsCount = chain.totalTransactions;
              });
              const value =
                (userscount / 2 + transactionsCount / 2) /
                (Minerate + coindiff);
              console.log(`fourth value is ${value}`);
              cstorageModel().update({}, { value: value }, (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`succes`);
                }
              });
            });
          }
        });
      }
    }
  });
};
module.exports = getCoinValue;
