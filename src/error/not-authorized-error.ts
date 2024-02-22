import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError{
    statusCode = 400;
    constructor(){
        super();
        // Simply because we are extending built in class Error
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
    serialize() {
        return [{ msg: 'Not Authorized' }];
    }
};