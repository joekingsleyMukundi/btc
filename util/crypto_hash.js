const crypto = require('crypto')
const crptoHash = (...pars)=>{
  const hash = crypto.createHash('sha256');

  hash.update(pars.sort().join(' '));

  return (hash.digest('hex'));
};
module.exports=crptoHash