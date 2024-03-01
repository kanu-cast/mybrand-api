import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    if(err instanceof CustomError){
        // console.log(err);
        return res.status(err.statusCode).send({ errors: err.serialize() });
    }else{

        console.log('this middleware err handler', err);
        res.status(400).send({
            errors:[{error:err, msg: err.message}]
        });
    }
};