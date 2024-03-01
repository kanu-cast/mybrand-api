import express, { Request, Response, NextFunction } from "express";
import { Message } from "../models/message";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { NotFoundError } from "../errors/not-found-error";

export const handleCreateMessage = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const { email, body } = req.body;
        const newMessage = await Message.create({
            email, body
        });
        await newMessage.save();
        return res.status(201).json({ status: 201, message:newMessage, msg:"Message sent successfully" });
    }catch(err){
        return next({err})
    }
};

export const handleFetchAllMessages = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const allMessages = await Message.find({ deleted:false });
        return res.status(200).json({ status:200, messages:allMessages, msg:"successfully retrieved Messages" });
    }catch(err){
        return next({err});
    }
};

export const handleFetchSingleMessage = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundMessage = await Message.findById(req.params.message_id);
        if(!foundMessage) throw new NotFoundError();
        return res.status(200).json({ status:200, message: foundMessage, msg:'Message retrieved successfully' });
    }catch(err){
        return next({err})
    }
}

export const handleDeleteMessage = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundMessage = await Message.findById(req.params.message_id);
        if(!foundMessage) throw new NotFoundError();
        foundMessage!.deleted = true;
        await foundMessage!.save()
        return res.status(200).json({status:200, msg:'Message deleted successfully' })
    }catch(err){
        return next({err});
    }
}