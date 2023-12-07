
const sendToken=(user,statuscode,res)=>{

    const token=user.getJWTToken();
    const options={
        expire: new Date(Date.now+ process.env.cookie_EXPIRES * 24*60*60*100),
        httpOnly:true
    }

    res.status(statuscode)
    .cookie('token',token,options)
    .json({success:true,token,user})

}


module.exports=sendToken;