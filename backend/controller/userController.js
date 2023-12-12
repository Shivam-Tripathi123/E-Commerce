const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError');
const sendToken = require("../utils/JWT_Token");
const sendEmail = require("../utils/sendEmail");
const crypto=require('crypto')


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


//Forgot password(this would send email with link to user to set up new password)

exports.forgotPassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email});

    if(!user)
    {
        return next(new ErrorHandler("Please Enter a valid Email(User not Fount)",404))
    }
    const resetToken=await user.getResetPasswordToken();
    // console.log(resetToken)
    await user.save({validateBeforeSave:false});

    const resetPasswordURL=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`Your Password reset token is :-\n\n ${resetPasswordURL}\n\n This is Valid for 15 minutes only.\n If u have not request then please ignore the message.`;

    try{
        await sendEmail({
            email:user.email,
            subject:"Ecommerce Password Reset",
            message:message
        });
        res.status(200).json({
            success:true,
            message:`Email is sent to ${user.email} successfully`
        })
    }
    catch(error)
    {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message));
    }
})




//Reset Password(controller for the link ehich is send by forget password controller)

exports.resetPassword=catchAsyncError(async(req,res,next)=>{
    
    //finding hashed value of token present in 
    //token is passed in param of the request from email URL
    const resetPasswordToken=crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")


    const user=await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        })

    if(!user)
    {
        return next(new ErrorHandler("Reset Password Token is Not Valid or Expired",400))
    }

    if(req.body.password !== req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password Doesn't Matched",400))
    }
    user.password=req.body.password;

    //now pasword is changed thewn make these field undefined
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();
    sendToken(user,200,res);
})




/* USER ROUTES */

/* NOW WE WILL CREATE ROUTES SPECIFICALLY FOR USER TO (GET HIS DETAILS) , (UPDATE HIS PASSWORD) AND (UPDATE HIS PROFILE) */

//get user details
exports.getUserDetails=catchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.user.id)//only logged in user can get its details

    res.status(200).json({
        success:true,
        user
    })
})


//Updation of the user password by his own(this controller is also accesed by only logged in user )

exports.updatePassword=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user.id).select("+password"); //logged in user is saved in req nd password need to explicity fetched

    //now first check whether current user has entered correrct old password
    const isMatched=await user.comparePassword(req.body.oldPassword,user.password);

    if(!isMatched)
    {
        return next(new ErrorHandler("Please Enter correct password(old Password didnt matced)",400))
    }
     
    //now we will check if new and renew password is same
    if(req.body.newPassword!==req.body.confirmNewPassword)
    {
        return next(new ErrorHandler("New Passowrds didn't matched",400))
    }

    user.password=req.body.newPassword;
    await user.save();//save new password

   // now as user,password is changed then again log in with new token
   sendToken(user,200,res)
})


//Update Profile by User (only logged in user can update his profile)

exports.updatePrile=catchAsyncError(async(req,res,next)=>{

    const newuserData={
        name:req.body.name,
        email:req.body.email
    }

    const user=await User.findByIdAndUpdate(req.user.id,newuserData,{
        new:true,
        runValidators:true
    })
    
    res.status(200).json({
        success:true,
        user
    })

})



/*ADMIN ROUTES*/

//Admin routes so that he can check(get) total number of users

exports.getAllUsers=catchAsyncError(async(req,res,next)=>{

    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//admin want to fetch one user details(user id would be sebd in param)

exports.getSingleUser=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("This user doesn't exist",400));
    }

    res.status(200).json({
        success:true,
        user
    })
})

//Admin want to update users details
//well get users id whose details need to be update in prams then
exports.updateUserRole=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData)

    await user.save();
    if(!user)
    {
        return next(new ErrorHandler("This user doesn't exist",400));
    }

    res.status(200).json({
        success:true,
        user
    })

})

//if admin want to delete a user then

exports.deleteUser=catchAsyncError(async(req,res ,next)=>{

    const user=await User.findByIdAndDelete(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("This user doesn't exist",400));
    }

    // await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})





