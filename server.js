require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const signUp = require("./routesconfig/signupconfig");
const login = require("./routesconfig/loginconfig");
const otpAuth = require("./routesconfig/otpverification");
const { addBlock } = require("./blockchain/addblock");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const {
  db,
  session,
  passport,
  passportLocalMongoose,
  userModel,
  blockchainModel,
} = require("./DB/DBconfig");
const { generator } = require("./config/config");
const timer = require("./config/timeGet");
const GnDbInserter = require("./config/genesisDb");
const { loginMailer } = require("./sendmail/sendmail");
const Transaction = require("./wallet/transactions");
const Blockchain = require("./blockchain/blockchain");
const { Wallet } = require("./wallet/walletindex");
const { createTransaction } = require("./wallet/transactions");
const {
  signUpMailer,
  registerNewNode,
  confirmNodeReg,
  senderEmail,
  recieverEmail,
  minerEmail,
} = require("./sendmail/sendmail");
const singIn = require("./routesconfig/loginconfig");

//creating our blockchaininstance

const Meitnerium = new Blockchain();
let nodeAddress;
let nodeUrl;
//middleware

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//passport middleware

app.use(
  session({
    secret: "hatebisadesceacecontrollyouranger",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(require("flash")());
app.use(passport.initialize());
app.use(passport.session());

//dbconnection
db();

//middleware
passport.use(userModel().createStrategy());

// serilize and deserilize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  userModel().findById(id, function (err, user) {
    done(err, user);
  });
});

//saving blochain insttance to the db
GnDbInserter();
//routes
// landing pg
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    userModel().findById({ _id: req.user.id }, (err, user) => {
      let result = user.wallet.publicKey;
      if (result !== undefined) {
        res.render("index", {
          authenticated: true,
          wallet: true,
          message: req.flash("message"),
        });
      } else {
        res.render("index", {
          authenticated: true,
          wallet: false,
          message: req.flash("message"),
        });
      }
    });
    nodeUrl = `http://www.meitneriumtrade.com/node/${req.user.id}`;
    blockchainModel().find({}, (err, chains) => {
      if (!err) {
        if (chains.length !== 0) {
          chains.forEach((chain) => {
            if (chain.blockchain.liveNodesUrl.includes(nodeUrl) === false) {
              blockchainModel().update(
                {},
                { $push: { "blockchain.liveNodesUrl": nodeUrl } },
                (err) => {
                  if (!err) {
                    blockchainModel().findOne(
                      { _id: chain.id },
                      (err, chain) => {
                        const networkNodes = chain.blockchain.networkNodes;
                        if (networkNodes.length !== 0) {
                          if (networkNodes.includes(nodeUrl) === false) {
                            const currenttime = timer();
                            const msg = `There is  a new  node ${nodeUrl} requesting to be registered check your email`;
                            networkNodes.forEach((networkNode) => {
                              const id = networkNode.substr(36);
                              userModel().findById(
                                { _id: id },
                                (err, foundeNodeUser) => {
                                  if (!err) {
                                    if (foundeNodeUser) {
                                      registerNewNode(
                                        foundeNodeUser.email,
                                        foundeNodeUser.username,
                                        nodeUrl
                                      );
                                      userModel().updateOne(
                                        { _id: id },
                                        {
                                          $push: {
                                            notifications: {
                                              msg: msg,
                                              time: currenttime,
                                            },
                                          },
                                        },
                                        (err) => {
                                          if (!err) {
                                            console.log(
                                              "success in pushing node to the nottifications"
                                            );
                                          } else {
                                            console.log(
                                              `the error in notifications is ${err}`
                                            );
                                          }
                                        }
                                      );
                                    }
                                  }
                                }
                              );
                            });
                          }
                        } else {
                          registerNewNode(process.env.EMAIL, "admin", nodeUrl);
                          console.log("admin added the node");
                        }
                      }
                    );
                  } else {
                    console.log(`err on pushing current node url is ${err}`);
                  }
                }
              );
            }
          });
        }
      }
    });
  } else {
    res.render("index", {
      authenticated: false,
      message: req.flash("message"),
    });
  }
});
//register nodes
app.get("/register-node/node/:id", (req, res) => {
  const id = req.params.id;
  const nodeToRegister = `http://www.meitneriumtrade.com/node/${id}`;
  userModel().findById({ _id: id }, (err, user) => {
    if (!err) {
      if (user) {
        blockchainModel().find({}, (err, chains) => {
          if (!err) {
            if (chains) {
              let newNumberOfAcceptees;
              let nodesRegistered;
              chains.forEach((chain) => {
                nodesRegistered = chain.blockchain.networkNodes.length;
                const acceptancepercentage = Number(user.nodeAcceptance);
                const numberOfacceptees =
                  (acceptancepercentage * nodesRegistered) / 100;

                newNumberOfAcceptees = numberOfacceptees + 1;
              });
              let newAcceptacePercentage;
              if (nodesRegistered === 0) {
                newAcceptacePercentage = (newNumberOfAcceptees * 100) / 1;
                userModel().updateOne(
                  { _id: id },
                  { nodeAcceptance: newAcceptacePercentage },
                  (err) => {
                    if (!err) {
                      console.log("success in updating thenode acceptance");
                    } else {
                      console.log(`err in node acceptance is ${err}`);
                    }
                  }
                );
                if (newAcceptacePercentage > 20) {
                  blockchainModel().update(
                    {},
                    { $push: { "blockchain.networkNodes": nodeToRegister } },
                    (err) => {
                      if (err) {
                        console.log(
                          `new node to be pushed in to the network errr is${err}`
                        );
                      } else {
                        confirmNodeReg(user.email, user.username);
                        console.log("success in update");
                        req.flash("message", "new node accepted succefully");
                        res.redirect("/");
                      }
                    }
                  );
                } else {
                  console.log("not yet accepted");
                  req.flash("message", "new node accepted succefully");
                  res.redirect("/");
                }
                console.log(newNumberOfAcceptees);
              } else {
                newAcceptacePercentage =
                  (newNumberOfAcceptees * 100) / nodesRegistered;
                userModel().updateOne(
                  { _id: id },
                  { nodeAcceptance: newAcceptacePercentage },
                  (err) => {
                    if (!err) {
                      console.log("success in updating thenode acceptance");
                    } else {
                      console.log(`err in node acceptance is ${err}`);
                    }
                  }
                );
                if (newAcceptacePercentage > 20) {
                  blockchainModel().update(
                    {},
                    { $push: { "blockchain.networkNodes": nodeToRegister } },
                    (err) => {
                      if (err) {
                        console.log(
                          `new node to be pushed in to the network errr is${err}`
                        );
                      } else {
                        confirmNodeReg(user.email, user.username);
                        console.log("success in update");
                        req.flash("message", "new node accepted succefully");
                        res.redirect("/");
                      }
                    }
                  );
                } else {
                  console.log("not yet accepted");
                  req.flash("message", "new node accepted succefully");
                  res.redirect("/");
                }
              }
            }
          }
        });
      }
    }
  });
});
//sign up
//get
app.get("/login", (req, res) => {
  res.render("signin");
});
//post
app.post("/login", (req, res) => {
  login(req, res);
});
//register
//get
app.get("/register", (req, res) => {
  res.render("signup");
});
//post
app.post("/register", (req, res) => {
  signUp(req, res);
});
//logout
app.get("/logout", (req, res) => {
  const userNode = `http://localhost:3000/node/${req.user._id}`;
  blockchainModel().update(
    {},
    { $pull: { "blockchain.liveNodesUrl": userNode } },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("your node is no longer live");
        req.logout();
        res.redirect("/");
      }
    }
  );
});
//otp
//get
app.get("/otp", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("otp");
  } else {
    console.log("no entry");
  }
});
//post
app.post("/otp", (req, res) => {
  if (req.isAuthenticated()) {
    otpAuth(req, res);
  } else {
    console.log("not elligible");
  }
});

//dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    let result = req.user.wallet.publicKey;
    if (result !== undefined) {
      nodeAddress = req.user.wallet.publicKey;
      res.render("dashboard", { user: req.user });
      console.log(req.user.notifications);
    } else {
      res.redirect("/");
    }
  } else {
    console.log("please log in or create an email");
    res.redirect("/login");
  }
});
//wallet creation
app.get("/wallet", (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.wallet.publicKey === undefined) {
      const userWallet = new Wallet();
      let signature = userWallet.sign(req.user);
      signature = {
        r: JSON.stringify(signature.r),
        s: JSON.stringify(signature.s),
        recoveryParam: signature.recoveryParam,
      };
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
      res.render("wallet");
    }
  } else {
    res.redirect("/login");
  }
});

//blockchain
app.get("/blockchain", (req, res) => {});

//trade route
app.get("/trade", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("trade");
  }
});
//transaction
app.post("/transaction", (req, res) => {
  if (req.isAuthenticated()) {
    userModel().findById({ _id: req.user.id }, (err, user) => {
      let result = user.wallet.publicKey;
      if (result !== undefined) {
        const wallet = user.wallet;
        const recipientPK = req.body.recipient;
        const amount = req.body.amount;
        const signature = user.signature;
        if (amount <= wallet.balance) {
          userModel().findOne(
            { "wallet.publicKey": recipientPK },
            (err, recipient) => {
              if (err) {
                console.log(err);
              } else if (recipient) {
                const recipientPublicAddress = recipient.wallet.publicKey;
                const transaction = createTransaction(
                  { wallet, recipient: recipientPublicAddress, amount },
                  signature
                );
                Meitnerium.setTransaction(transaction);
                blockchainModel().find({}, (err, chainArry) => {
                  if (!err) {
                    chainArry.forEach((chain) => {
                      const transactions = Meitnerium.transactionPool;
                      transactions.forEach((transaction) => {
                        const newSenderBalance =
                          transaction.transactions.outPutMap
                            .senderWalletBalance;
                        blockchainModel().update(
                          {},
                          {
                            $push: {
                              "blockchain.transactionPool": transaction,
                            },
                          },
                          (err) => {
                            if (err) {
                              console.log(`transaction push err is ${err}`);
                            } else {
                              console.log(`succefull transaction`);
                              const msgToSender = `Hello ${req.user.username} you have succefully transfered ${amount} worh of MTN coins to adress ${recipientPublicAddress}. The  transaction code is ${transaction.transactions.outPutMap.refCode}.your new balance is ${newSenderBalance}.We have sent you an email as a reference of your transaction
                          `;
                              userModel().updateOne(
                                { _id: req.user.id },
                                {
                                  "wallet.balance": newSenderBalance,
                                  $push: { notifications: msgToSender },
                                },
                                (err) => {
                                  if (err) {
                                    console.log(
                                      `err in updating balance is  ${err}`
                                    );
                                  } else {
                                    console.log("updatade balance");
                                    const reciept = {
                                      sellerusername: req.user.username,
                                      selleruserId: req.user.wallet.publicKey,
                                      recipientid: recipientPublicAddress,
                                      amount: amount,
                                      sellerbalance: newSenderBalance,
                                    };
                                    senderEmail(
                                      req.user.email,
                                      req.user.username,
                                      amount,
                                      recipientPublicAddress,
                                      reciept
                                    );
                                    const recipientBalance =
                                      Number(recipient.wallet.balance) +
                                      Number(amount);

                                    const msgToReciver = `Hello ${recipient.username} you have recieved ${amount} worth of MTN from ${req.user.wallet.publicKey} under the refrence code ${transaction.transactions.outPutMap.refCode}.your new balance is ${recipientBalance}.We have sent you an email as a reference of your transaction`;
                                    userModel().updateOne(
                                      {
                                        "wallet.publicKey": recipientPublicAddress,
                                      },
                                      {
                                        "wallet.balance": recipientBalance,
                                        $push: { notifications: msgToReciver },
                                      },
                                      (err) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          const reciept = {
                                            sellerusername: req.user.username,
                                            selleruserId:
                                              req.user.wallet.publicKey,
                                            recipientid: recipientPublicAddress,
                                            amount: amount,
                                            buyerbalance: recipientBalance,
                                          };
                                          recieverEmail(
                                            recipient.email,
                                            recipient.username,
                                            amount,
                                            req.user.wallet.publicKey,
                                            reciept
                                          );
                                          res.send(transaction);
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      });
                    });
                  }
                });
              }
            }
          );
        } else {
          res.send("You cant transact mor than your balance");
        }
      } else {
        console.log("no wallet");
      }
    });
  } else {
    console.log("no");
  }
});

app.get("/selloffers", (req, res) => {
  res.render("selloffers");
});
app.get("/buyoffers", (req, res) => {
  res.render("buyoffers");
});

app.get("/createoffer", (req, res) => {
  res.render("createoffer");
});

app.get("/price-details", (req, res) => {
  res.render("price-details");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});
app.get("/settings-profile", (req, res) => {
  res.render("settings-profile");
});
app.get("/settings-activity", (req, res) => {
  res.render("settings-activity");
});
const miner = () => {
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

setInterval(() => {
  miner();
}, 120000);

const port = process.env.PORT || 3000;
io.on("connection", (socket) => {
  console.log(`user connected`);
  setInterval(() => {
    const randomNumber = Math.random();
    io.emit("randomValue", randomNumber);
  }, 1000);
});
http.listen(port, () => {
  console.log(`server live at port${port}`);
});
