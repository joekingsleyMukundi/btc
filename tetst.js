const User = userModel();
app.get("/", (req, res) => {
  User.findById({ _id: "601e8e412cb79b1506f558cc" }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      const wallet = new Wallet();
      let signature = wallet.sign(user);
      signature = JSON.stringify(signature);
      User.update(
        { _id: "601e8e412cb79b1506f558cc" },
        { wallet: JSON.stringify(wallet), sign: signature },
        (err) => {
          if (!err) {
            console.log(signature);
          }
        }
      );
    }
  });
});
app.get("/tr", (req, res) => {
  User.findById({ _id: "601e8e412cb79b1506f558cc" }, (err, user) => {
    if (user) {
      const wallet = JSON.parse(user.wallet);
      const signature = JSON.parse(user.sign);
      const amount = 100;
      if (wallet.balance > amount) {
        const trans2 = new Transaction(
          {
            wallet: wallet,
            recipient: "guyfdtd",
            amount: 100,
          },
          signature
        );
        console.log(trans2);
      }
    }
  });
});

blockchainModel().update(
  {},
  { $push: { "blockchain.liveNodesUrl": nodeUrl } },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`successs in push`);
    }
  }
);

if (foundusernode) {
  registerNewNode(foundusernode.email, foundusernode.username, nodeUrl);
  userModel().updateOne(
    { _id: id },
    { $push: { notifications: msg } },
    (err) => {
      if (!err) {
        console.log("success in pushing node to the nottifications");
      } else {
        console.log(`the error in notifications is ${err}`);
      }
    }
  );
}

app.get("/mine", (req, res) => {
  if (req.isAuthenticated()) {
    blockchainModel().find({}, (err, chainArry) => {
      if (!err) {
        if (chainArry) {
          let dataObjects;
          let dataObjectArray;
          let lastBlock;
          let index;
          let poolLenth;
          const transactions = [];
          chainArry.forEach((chain) => {
            poolLenth = chain.blockchain.transactionPool.length;
            dataObjects = {
              transaction: chain.blockchain.transactionPool,
            };
            dataObjectArray = dataObjects.transaction;
            dataObjectArray.forEach((dataObject) => {
              transaction = {
                id: dataObject.id,
                transactions: JSON.stringify(dataObject.transactions),
              };
              transactions.push(transaction);
            });
            const length = chain.blockchain.chain.length;
            lastBlock = chain.blockchain.chain[length - 1];
            index = length + 1;
          });
          const newMinedBlock = addBlock(lastBlock, index, transactions);
          setTimeout(() => {
            console.log(`hello`);
          }, 2000);
          blockchainModel().update(
            {},
            { $push: { "blockchain.chain": newMinedBlock } },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                chainArry.forEach((chain) => {
                  let i;
                  for (i = 0; i < poolLenth - 1; i++) {
                    const transactionToPull =
                      chain.blockchain.transactionPool[i];
                    console.log(transactionToPull.id);
                    // blockchainModel().update(
                    //   {},
                    //   {
                    //     $pull: {
                    //       "blockchain.transactionPool": transactionToPull,
                    //     },
                    //   },
                    //   (err) => {
                    //     if (err) {
                    //       console.log(err);
                    //     } else {
                    //       console.log(`success`);
                    //     }
                    //   }
                    // );
                  }
                });
                // const MasterWallet = new Wallet();
                // const amount = 100;
                // const promiseCode = Math.floor(1000 + Math.random() * 9000);
                // userModel().updateOne(
                //   { _id: req.user.id },
                //   { minerCode: promiseCode }
                // );
                // const link = `http://localhost:3000/miner/:${req.user.id}/rewd-cd/:${promiseCode}`;
                // minerEmail(
                //   req.user.email,
                //   req.user.username,
                //   amount,
                //   MasterWallet.publicKey,
                //   link
                // );
              }
            }
          );
        }
      }
    });
  } else {
    console.log(`not authenticated`);
  }
});
