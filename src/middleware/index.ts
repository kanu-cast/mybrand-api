require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { BadRequestError } from '../errors/bad-request-error'
import { NotAuthorizedError } from "../errors/not-authorized-error"

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

export async function checkIsUserAdmin(req:Request, res:Response, next:NextFunction){
    try{
        const userToken = req.headers.authorization?.split(' ')[1].trim();
        if(!userToken) return next(new BadRequestError('Invalid/Expired token'));
        const data = jwt.verify(userToken, SECRET);
        if(data.role != 'admin') return next(new NotAuthorizedError("You are Not authorized"));
        req.userId = data.id;
        req.role = data.role;
        return next();
    }catch(err){
        return next({ err })
    }
};
export async function authorizeUser(req:Request, res:Response, next:NextFunction){
    try{
        const userToken = req.headers.authorization?.split(' ')[1].trim()
        console.log('this is userToken', req.headers.authorization);
        if(!userToken) return next(new BadRequestError('Invalid/Expired token'));
        const data = jwt.verify(userToken, SECRET);
        if(!data) return next(new NotAuthorizedError("You are not authorized"));
        req.userId = data.id;
        req.role = data.role;
        return next();
    }catch(err){
        return next({ err })
    }
};