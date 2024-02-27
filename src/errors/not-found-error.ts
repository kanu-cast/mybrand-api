import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError{
    statusCode = 404;
    constructor(){
        super();
        //Simply because we are extending a built in class i.e Error
        Object.setPrototypeOf(this, NotFoundError.prototype);
    };
    serialize(){
        return [{ msg:"Not found"}]
    }
};