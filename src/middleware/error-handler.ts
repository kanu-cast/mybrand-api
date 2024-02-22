import { Request, Response, NextFunction } from "express";
import { CustomError } from "../error/custom-error";

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof CustomError){
        console.log(err);
        return res.status(err.statusCode).send({ errors: err.serialize() });
    }
    console.log(err);
    res.status(500).send({
        errors:[{error:err, msg: 'Oops! something went wrong but our team is up to fixing it, Please try again later'}]
    });
};