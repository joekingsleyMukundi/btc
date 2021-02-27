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
