const ErrorHandler=require('../utils/errorHandler');

module.exports=(err,req,res,next)=>{

    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal Server Error";


    //wrong Mongo Id for items (digit other than standard digits)
    if(err.name==="CastError")
    {
        const message=`Resource not Found. Invalid: ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    //if we try to register user with already register email then it would give error "Duplicate key Error" with errorCode=11000 so lets handle thar error
    if(err.code===11000)
    {
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        //It will give message duplicate email entered ;
        err=new ErrorHandler(message,400);
    }

    //if someone entered wrong jsonwebtoken then 
    if(err.name==="JsonWebTokenError")
    {
        const message="Json Web Token is invalid. Please try again";
        err=new ErrorHandler(message,400)
    }

    //if token is expired
    if(err.name==="tokenExpiredError")
    {
        const message="Json Web Token is Expired. Please try again";
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        stack:err.stack
    })
}