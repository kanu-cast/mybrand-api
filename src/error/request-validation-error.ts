import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError{
    statusCode = 400;
    constructor(private errors: any){
        super();
        // Simply because we are extending built in class Error
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    serialize() {
        return this.errors.details.map(err => {
            return { msg: err.message , field: err.path[0] }
        });
    }
};