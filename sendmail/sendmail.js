require("dotenv").config();
const nodemailer = require("nodemailer");
const { mailTransporter } = require("./sendmail_transporter");
const {
  signUpOptions,
  registerNewNodeOptions,
  confirmNodeRegOptions,
  senderEmailOptions,
  recipientEmailOptions,
  minerRewardEmail,
} = require("./sendMailOptions");
const signUpMailer = (email, fullname, pin) => {
  mailTransporter().sendMail(
    signUpOptions(email, fullname, pin),
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success" + data);
      }
    }
  );
};

const registerNewNode = (email, username, newNodeUrl) => {
  mailTransporter().sendMail(
    registerNewNodeOptions(email, username, newNodeUrl),
    (err, data) => {
      if (err) {
        console.log(`new node reg email err is ${err}`);
      } else {
        console.log(`Success ${data}`);
      }
    }
  );
};

const confirmNodeReg = (email, username) => {
  mailTransporter().sendMail(
    confirmNodeRegOptions(email, username),
    (err, data) => {
      if (err) {
        console.log(`successfull node rgistratin email send err is ${err}`);
      } else {
        console.log(`success cinfarm mail sent ${data}`);
      }
    }
  );
};

const senderEmail = (email, username, amount, recipientAddress, reciept) => {
  mailTransporter().sendMail(
    senderEmailOptions(email, username, amount, recipientAddress, reciept),
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`sender email sent ${data}`);
      }
    }
  );
};
const recieverEmail = (email, username, amount, senderAddress, reciept) => {
  mailTransporter().sendMail(
    recipientEmailOptions(email, username, amount, senderAddress, reciept),
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`sender email sent ${data}`);
      }
    }
  );
};

const minerEmail = (email, username, amount, senderAddress, link) => {
  mailTransporter().sendMail(
    minerRewardEmail(email, username, amount, senderAddress, link),
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`seccefull mining reword email ${data}`);
      }
    }
  );
};
module.exports = {
  signUpMailer,
  registerNewNode,
  confirmNodeReg,
  senderEmail,
  recieverEmail,
  minerEmail,
};
