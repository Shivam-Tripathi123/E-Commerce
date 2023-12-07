const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError');
const sendToken = require("../utils/JWT_Token");


//Registering the user

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name, email, password}=req.body;

    const user=await User.create({name,email,password,
    avatar:{
        public_id:"Sample ID",
        url:"Sample URL"
    }});

    return sendToken(user,201,res);
    
})

//Login the user

exports.loginUser=catchAsyncError(async (req,res,next)=>{

    const {email,password}=req.body;

    //Checking if user has given password and email both
    if(!email || !password)
    {
        return next(new ErrorHandler("Please Enter Email & Password",400));
    }

    const user=await User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("User Doesnt Exists(Invalid Email or Passsord)",401))
    }

    const isPasswordMatched= await user.comparePassword(password);

    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Invalid Email or Passsord",401))

    }

    return sendToken(user,201,res);
})

//Logging Out User

exports.logout=catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null, {
        expires:new Date(Date.now()),
        httpOnly:true
    })

     res.status(200).json({
        success:true,
        message:"User Logged Out Successfully"
    })
})