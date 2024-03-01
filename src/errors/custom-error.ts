export abstract class CustomError extends Error{
    abstract statusCode: number;
    constructor(){
        super();
        //Simply because we are extending a built in class i.e Error
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    abstract serialize():{msg: string, field?:string }[];
};