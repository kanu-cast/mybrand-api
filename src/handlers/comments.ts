import express, { Request, Response, NextFunction } from "express";
import { Blog } from "../models/blog";
import { Comment } from "../models/comment";
import { NotFoundError } from '../errors/not-found-error';
import { ObjectId } from "mongodb";

export const handleCreateComment = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundBlog = await Blog.findById(req.params.blog_id);
        if(!foundBlog) return next(new NotFoundError("Blog Not Found"));
        const newComment = Comment.build({
            author: req.userId!,
            body: req.body.body,
            blog: foundBlog._id as ObjectId
        });
        await newComment.save();
        foundBlog.comments.push(newComment._id as ObjectId);
        await foundBlog.save();
        const updatedBlog = await Blog.findById(foundBlog._id)
        .populate({
            path: 'comments',
            select:'body',
            populate:{
                path:'author',
                select:'firstName lastName'
            }
        });
        return res.status(201).json({ status:201, blog:updatedBlog, msg:'Created comment successfully' });
    }catch(err){
        return next(err);
    }
};

export const handleLikeComment = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const comment = await Comment.findById(req.params.comment_id);
        if(!comment) return next(new NotFoundError("Comment Not Found"));
        const check = comment.likes.includes(req.userId!);
        const check2 = comment.disLikes.includes(req.userId!);
        if(check){
            var index = comment.likes.indexOf(req.userId!);
            if (index >= 0) {
                comment!.likes.splice(index, 1);
            }
        }else{
            comment.likes.push(req.userId!);
        }if(check2){
            var index = comment.disLikes.indexOf(req.userId!);
            if (index >= 0) {
                comment.disLikes.splice(index, 1);
            }
        }
        await comment.save();
        const allComments = await Comment.find({ blog: comment.blog }).populate('author','firstName lastName');
        return res.status(200).json({ status:200, comments: allComments, commentLikes:comment.likes, commentDislikes:comment.disLikes, msg:'Reaction added successfully' });
    }catch(err){
        return next(err);
    }
};

export const handleDislikeComment = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const comment = await Comment.findById(req.params.comment_id);
        if(!comment) return  next( new NotFoundError("Comment Not Found"));

        const check = comment.disLikes.includes(req.userId!);
        const check2 = comment.likes.includes(req.userId!);

        if(check){
            var index = comment!.disLikes.indexOf(req.userId!);
            if (index >= 0) {
                comment!.disLikes.splice(index, 1);
            }
        }else{
            comment!.disLikes.push(req.userId!);
        }if(check2){
            var index = comment!.likes.indexOf(req.userId!);
            if (index >= 0) {
                comment!.likes.splice(index, 1);
            }
        }
        await comment.save();
        const allComments = await Comment.find({ blog: comment.blog }).populate('author','firstName lastName');
        return res.status(200).json({ status:200, comments:allComments, commentLikes:comment.likes, commentDislikes:comment.disLikes, msg:'Reaction added successfully' });
    }catch(err){
        return next(err)
    }
};
