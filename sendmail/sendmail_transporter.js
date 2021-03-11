require("dotenv").config();
const nodemailer = require("nodemailer");

const mailTransporter = () => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "meitneriumtrade@gmail.com",
      pass: "Meitnerium254#",
    },
  });
  return transporter;
};

module.exports = { mailTransporter, nodemailer };
