require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { NotAuthorizedError } from "../errors/not-authorized-error";
const jwt = require("jsonwebtoken");
const passport = require('passport');
require('../../passport-config')(passport);

const SECRET = process.env.SECRET_KEY as string;

declare global {
    namespace Express {
        interface Request {
            userId?: Types.ObjectId;
            role?:string;
        }
    }
}

export const checkIsUserAdmin = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const userToken = req.headers.authorization?.split(' ')[1].trim();
        const data = jwt.verify(userToken, SECRET);
        if(data.role != 'admin') throw new NotAuthorizedError();
        req.userId = data.id;
        req.role = data.role;
        return next();
    }catch(err){
        return next({ err })
    }
};
export const authorizeUser= async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const userToken = req.headers.authorization?.split(' ')[1].trim()
        const data = jwt.verify(userToken, SECRET);
        req.userId = data.id;
        req.role = data.role;
        return next();
    }catch(err){
        return next({ err })
    }
};