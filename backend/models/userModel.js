const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Name"],
        maxLength:[40,"Name Cannot exceed 40 char"],
        minLength:[3,"Name must be greater than 5 char"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter  valid email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Password"],
        minLength:[8,"Password should be greater than 8 character"],
        select:false
    },
    avatar:{
        public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
   },
   role:{
    type:String,
    default:"user"
   },
   resetPasswordToken:String,
   resetPasswordExpire:Date
})

//Creating method for userSchema to hashed the password
userSchema.pre("save",async function(next){
    //if password is not getting changed(modified)
    if( ! this.isModified("password"))
    {
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})


//JWT Token

userSchema.methods.getJWTToken=function ()
{
    return jwt.sign({id:this._id},process.env.JWTSecret,
        {
            expiresIn:process.env.JWTExpire
        });
}

//Compare Password
userSchema.methods.comparePassword=async function (enteredPassword)
{
    const isMatched=await bcrypt.compare(enteredPassword,this.password);
    return isMatched;
}

module.exports=mongoose.model("User", userSchema);
