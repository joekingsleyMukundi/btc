require("dotenv").config();
let signUpOptions = (email, fullname, pin) => {
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "Successfull registration",
    text: `Welcome ${fullname} your one time pin is ${pin}.You are now a new node in the network all members will recive an email so as to register your new node, you will requre 20% approval  from the others  so as to limit froud as other measures have been made to eliminate froud.Welcome on board.`,
  };
  return options;
};
let registerNewNodeOptions = (email, username, newNodeUrl) => {
  const id = newNodeUrl.substr(36);
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "new node registration",
    text: `Greatings ${username} there is a new member ${newNodeUrl} requesting to join the network  and you as a member of this network are requested to approve his/her request.Click this link to approve  the new node. http://www.meitneriumtrade.com/register-node/node/${id}`,
  };
  return options;
};

let confirmNodeRegOptions = (email, username) => {
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "successfull node redgistration",
    text: `Greatings ${username} we are proud to anounce that your node has been accepted and registered succefully  you are now free to veiw the transaction ledgers. Next time a new node will appear  you will be required to accept to add it  to the network`,
  };
  return options;
};

let senderEmailOptions = (
  email,
  username,
  amount,
  recipientAddress,
  reciept
) => {
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "transaction reciept",
    text: `Hello ${username} This is to notify you of your successfull transaction to ${recipientAddress} of  amount ${amount}worth of MTN coins this is the recipt ${reciept}. you are also requested to leave a review on the buyer.Thank you for trading with  and in Meitnerium `,
  };
  return options;
};

let recipientEmailOptions = (
  email,
  username,
  amount,
  senderAddress,
  reciept
) => {
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "Transaction reciept",
    text: `Hello ${username} This is to notify you of your successfull transaction from ${senderAddress} of  amount ${amount}worth of MTN coins this is the recipt ${reciept}. you are also requested to leave a review on the seller.Thank you for trading with  and in Meitnerium `,
  };
  return options;
};

let minerRewardEmail = (email, username, amount, senderAddress, link) => {
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "Mining Reword",
    text: `Hello ${username} This is to notify you of your successfull transaction from ${senderAddress} of  amount ${amount}worth of MTN coins this is the recipt. you are also requested to leave a review on the seller.Thank you for trading with  and in Meitnerium. click this link to get your reword ${link} `,
  };
  return options;
};

module.exports = {
  signUpOptions,
  registerNewNodeOptions,
  confirmNodeRegOptions,
  senderEmailOptions,
  recipientEmailOptions,
  minerRewardEmail,
};
