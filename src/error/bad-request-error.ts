import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError{
    statusCode = 400;
    constructor(public message:string){
        super();
        // Simply because we are extending built in class Error
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    serialize() {
        return [{ msg: this.message }];
    }
}