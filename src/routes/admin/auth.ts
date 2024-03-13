import express, { NextFunction, Request, Response } from "express";
const router  = express.Router({mergeParams: true});

import { User } from '../../models/user';
import {  NotFoundError } from "../../errors/not-found-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";

router.get('/',
async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const allUsers = await User.find({ });
        if(!allUsers) next( new NotFoundError('Users Not Found'));
        return res.status(200).json({ status:200, users:allUsers, msg:"successfully retrieved Users" });
    }catch(err){
        return next(err);
    }
});

export { router as usersAdminRoutes };
