import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
const router  = express.Router({mergeParams: true});
import { User } from '../../models/user';
import jwt from "jsonwebtoken";
import { UserDoc } from '../../models/interfaces/user';
import { validateSignin, validateSignup } from '../../middleware/validate-request';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';

const SECRET = process.env.SECRET_KEY as string;

router.post('/signup', validateSignup, 
 async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const newUser = User.build({
            firstName:req.body.firstName, 
            lastName:req.body.lastName, 
            password:req.body.password,
            email:req.body.email,
        });
        await newUser.save();
        const createdUser:UserDoc = await User.findById(newUser._id).select('-password');
        const { id, email, firstName, lastName, role } = createdUser;
        if(createdUser){
            let token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30days
                    id,
                    email,
                    firstName, 
                    lastName, 
                    role
                },
                SECRET!
            );
            return res.status(200).json({ msg:'Created account successfully', token});
        }
    }catch(err){
        return next({ err });
    }
});
router.post('/signin', validateSignin, 
async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundUser = await User.find({
            email: req.body.email
        });
        const user = foundUser[0];
        if(!user) throw new BadRequestError('invalid email/password combination')
        const { id, email, firstName, lastName, role } = user;
        let isMatch = await user.comparePassword(req.body.password);
        if(!isMatch) throw new BadRequestError('Invalid Email/Password combination');
        let token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30days
                id,
                email,
                firstName, 
                lastName, 
                role
            },
            SECRET
        );
        res.status(200).json({ msg:'Successfully logged you in', token });
    }catch(err){
        return next({ err });
    }
});


export { router as authRoutes };