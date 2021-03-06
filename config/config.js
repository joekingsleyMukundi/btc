const hasher = require("../util/crypto_hash");

const generator = () => {
  let otp = Math.floor(1000 + Math.random() * 9000);
  var val = Math.floor(1000 + Math.random() * 9000);
  let otpHashed = hasher(otp);
  return { otp, otpHashed };
};

const UNIQID = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

module.exports = { generator, UNIQID };
