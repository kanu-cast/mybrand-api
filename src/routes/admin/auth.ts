import express, { NextFunction, Request, Response } from "express";
const router  = express.Router({mergeParams: true});
import { User } from '../../models/user';
import { UserDoc } from '../../models/interfaces/user';
import { BadRequestError } from '../../error/bad-request-error';

router.post('/signout', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundUser:UserDoc | null = await User.findById(req.userId!);
        if(!foundUser) throw new BadRequestError('User not Found');
        foundUser.lastActive = Date.now().toString();
        await foundUser!.save();
        return res
            .status(200)
            .json({status:200, message: "Successfully logged you out" });
    }catch(err){
      return next({ err });
    }
});

export { router as signoutRoute };