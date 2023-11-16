
// Error is default class of Node which takes one argument i.e. message

class ErrorHandler extends Error {

    constructor(message , statusCode)
    {
        super(message);
        this.statusCode=statusCode;
    }

}

module.exports=ErrorHandler;