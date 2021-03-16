const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  blockchainModel,
} = require("../DB/DBconfig");
const Blockchain = require("../blockchain/blockchain");
const Meitnerium = new Blockchain();
const genesisCreator = () => {
  blockchainModel().find({}, (err, chain) => {
    if (!err) {
      if (chain.length === 0) {
        const Blockchain = blockchainModel();
        let blockchainObject;
        Meitnerium.chain.forEach((Meitneri) => {
          blockchainObject = {
            chain: [
              {
                index: Meitneri.index,
                timestamp: Meitneri.timestamp,
                data: Meitneri.data,
                lastHash: Meitneri.lastHash,
                hash: Meitneri.hash,
                nonce: Meitneri.nonce,
                difficulty: Meitneri.difficulty,
              },
            ],
          };
        });
        const blockchain = new Blockchain({
          blockchain: blockchainObject,
          totalTransactions: 0,
        });
        blockchain.save((err) => {
          if (!err) {
            console.log(`succefully made the chain ${blockchainObject}`);
          } else {
            console.log(`err is ${err}`);
          }
        });
      } else {
        console.log(`its already registered`);
      }
    } else {
      console.log(`err in saving blockchain instance is ${err}`);
    }
  });
};

module.exports = genesisCreator;
