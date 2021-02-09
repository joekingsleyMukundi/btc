const {db,session,passport,passportLocalMongoose,userModel} = require('../DB/DBconfig');
const otpVerifiction = (req,res)=>{
  userModel().findById({_id:req.user.id},(err,user)=>{
    if(err){
      console.log(err);
    }else{
      if(user.otp == req.body.otp){
        console.log('email verified');
        res.redirect('/')
      }else{
        res.redirect('/otp')
      }
    }
  })
}

module.exports = otpVerifiction;