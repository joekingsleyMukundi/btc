const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  blockchainModel,
} = require("../DB/DBconfig");
const miner = (req, res) => {
  blockchainModel().find({}, (err, blockchainArry) => {
    if (err) {
      console.log(err);
    } else {
      blockchainArry.forEach((blockchain) => {
        const transactionPool = blockchain.blockchain.transactionPool;
        const blockchainObj = blockchain.blockchain.chain;
        if (transactionPool.length != 0) {
          const transactions = [];
          let transactionToPull;
          transactionPool.forEach((transactionObject) => {
            const transaction = {
              id: transactionObject.id,
              transactions: JSON.stringify(transactionObject.transactions),
            };
            transactions.push(transaction);
            transactionToPull = {
              id: transactionObject.id,
              transactions: transactionObject.transactions,
            };
            blockchainModel().update(
              {},
              { $pull: { "blockchain.transactionPool": transactionToPull } },
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(
                    `success in pulling transaction with id ${transactionToPull.id}`
                  );
                }
              }
            );
          });
          const len = blockchainObj.length;
          const lastBlock = blockchainObj[len - 1];
          const index = len + 1;
          const newMinedBlock = addBlock(lastBlock, index, transactions);
          console.log(newMinedBlock);
          blockchainModel().update(
            {},
            { $push: { "blockchain.chain": newMinedBlock } },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log(`succefully added anew mined block  `);
                req.flash("message", "new block mined succefully");
                res.redirect("/");
              }
            }
          );
        } else {
          console.log("no transaction");
        }
      });
    }
  });
};

module.exports = miner;
