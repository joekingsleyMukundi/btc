require("dotenv").config()
let signUpOptions=(email,fullname,pin)=>{
  let options = {
    from: "meitneriumtrade@gmail.com",
    to: email,
    subject: "Successfull registration",
    text: `Welcome ${fullname} your one time pin is ${pin}`,
  };
  return options;
}

module.exports = {signUpOptions};