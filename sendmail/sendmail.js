        require("dotenv").config();
        const nodemailer = require("nodemailer")
        const {mailTransporter} = require('./sendmail_transporter');
        const {signUpOptions} = require("./sendMailOptions")
        const signUpMailer=(email,fullname,pin)=>{
        mailTransporter().sendMail(signUpOptions(email,fullname,pin), (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("success" + data);
          }
        });
      }
      module.exports = {signUpMailer}