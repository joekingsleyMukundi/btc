const { Wallet, sign, createTransaction } = require("../wallet/walletindex");
const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
} = require("../DB/DBconfig");
const wCreator = (req, res) => {
  if (req.isAuthenticated()) {
    const userWallet = new Wallet();
    const signature = userWallet.sign(req.user);
    const wallet = {
      balance: userWallet.balance,
      keyPair: JSON.stringify(userWallet.keyPair),
      publicKey: userWallet.publicKey,
    };
    userModel().updateOne(
      { _id: req.user.id },
      { wallet: wallet, signature: signature },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("wallet and signature succefully created");
          res.redirect("/dashboard");
        }
      }
    );
  } else {
    res.redirect("/login");
  }
};
module.exports = { wCreator };
