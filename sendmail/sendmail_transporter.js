require("dotenv").config()
const nodemailer = require('nodemailer');

const mailTransporter = ()=>{
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  return transporter
}

module.exports = {mailTransporter,nodemailer}