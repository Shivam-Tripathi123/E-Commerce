const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require('jsonwebtoken')

exports.isAuthenticatedUser=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token)
    {
        return next(new ErrorHandler("Please Login to access this resource" , 401));
    }    


    const decoded=jwt.verify(token,process.env.JWTSecret);//finding actual id corresponding to this token

    req.user=await User.findOne({_id:decoded.id});//saving the user with this id user in the req
    next();
})

