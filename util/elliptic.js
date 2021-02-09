const EC = require("elliptic").ec
const hasher = require("./crypto_hash")
const ec = new  EC('secp256k1');

const verifySignature = ({publicKey,data,signature})=>{
  const keyFromPublic = ec.keyFromPublic(publicKey,'hex')

  return keyFromPublic.verify(hasher(data),signature)
}

module.exports={ec,verifySignature};