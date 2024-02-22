import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError{
    statusCode = 400;
    reason = "Sorry, Couldn't Perform task at the moment, Please try again later";
    constructor(){
        super();
        // Simply because we are extending built in class Error
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
    serialize() {
        return [{ msg: this.reason }];
    }
};