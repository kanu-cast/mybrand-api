import express, { NextFunction, Request, Response } from 'express';
import { Blog } from '../models/blog';
import { uploadFiles } from '../services/cloudinary';
import { User } from '../models/user';
import { dataUri } from '../services/data-uri';
import { NotFoundError } from '../error/not-found-error';
import { NotAuthorizedError } from '../error/not-authorized-error';
import { BadRequestError } from '../error/bad-request-error';

interface Image {
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    type: string;
}
export const handleFetchAllBlogs = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const allBlogs = await Blog.find({deleted: false});
        return res.status(200).json({ status:200, blogs:allBlogs, msg:'Retrieved blogs successfully' });
    }catch(err){
        return next({err});
    }
};

export const handleFetchSingleBlog = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const filter = { _id: req.params.blog_id, deleted:false};
        const blog = await Blog.find(filter).populate('comments','author likes dislikes body createdAt updatedAt');
        if(!blog.length) throw new NotFoundError();
        return res.status(200).json({ status:200, blog, msg:'Retrieved Blog successfully' });
    }catch(err){
        return next({err});
    }
};

export const handleCreateBlog = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        if(req.role !=='admin') throw new NotAuthorizedError();
        let blogImage:Partial<Image> = {};
        // handling image with cloudinary
        if("uploadedImage" in req.files!){
            const uploadedBlogImage = req.files.uploadedImage[0];
            const base64image = dataUri(uploadedBlogImage);
            const cloudImg = await uploadFiles( base64image.content, { folder:"blogImages"}, function(err, result){
                if(err){ console.log(err); return res.json(err);} console.log(result); return result;
            });
            blogImage.url = cloudImg.url;
            blogImage.public_id = cloudImg.public_id;
            blogImage.width = cloudImg.width;
            blogImage.height = cloudImg.height;
            blogImage.format = cloudImg.format;
            blogImage.bytes = cloudImg.bytes;
            blogImage.type = cloudImg.resource_type;
        }else{
            throw new BadRequestError('Please add Image for Blog')
        }
        const { title, body} = req.body;
        const newBlog = await Blog.create({
           title,
           body,
           author: req.userId,
           imageObj:blogImage
        });
        await newBlog.save();
        const user = await User.findById(req.userId);
        user!.blogs.push(newBlog._id);
        await user!.save();
        return res.status(201).json({ status:201, blog:newBlog, msg:'Blog created succesfully' });
    }catch(err){
        return next({err});
    }
};

export const handleUpdateBlog = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        if(req.role !=='admin') throw new NotAuthorizedError();
        const foundBlog = await Blog.findById(req.params.blog_id);
        if(foundBlog!.author.toString() !== req.userId!.toString()) throw new NotAuthorizedError();
        let blogImage:Partial<Image> = foundBlog!.imageObj;
        // handling image with cloudinary
        if("uploadedImage" in req.files!){
            const uploadedBlogImage = req.files.uploadedImage[0];
            const base64image = dataUri(uploadedBlogImage);
            const cloudImg = await uploadFiles( base64image.content, { folder:"blogImages"}, function(err, result){
                if(err){ console.log(err); return res.json(err);} console.log(result); return result;
            });
            blogImage.url = cloudImg.url;
            blogImage.public_id = cloudImg.public_id;
            blogImage.width = cloudImg.width;
            blogImage.height = cloudImg.height;
            blogImage.format = cloudImg.format;
            blogImage.bytes = cloudImg.bytes;
            blogImage.type = cloudImg.resource_type;
        }
        //updating blog
        const { title, body } = req.body;
        foundBlog!.title = title;
        foundBlog!.body = body;
        foundBlog!.imageObj = blogImage;
        await foundBlog!.save();
        return res.status(200).json({ status:200, blog:foundBlog, msg:'Blog updated Successfully' });
    }catch(err){
        return next({err});
    }
};

export const handleLikeBlog = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const foundBlog = await Blog.findById(req.params.blog_id);
        const check = foundBlog!.likes.includes(req.userId!)
        if(check){
            const index = foundBlog!.likes.indexOf(req.userId!);
            const newLikes = foundBlog!.likes.splice(index, 1);
            foundBlog!.likes = newLikes;
        }else{
            foundBlog!.likes.push(req.userId!);
        }
        await foundBlog!.save();
        return res.status(200).json({ status:200, blog:foundBlog, msg:'Blog Updated successfully' });
    }catch(err){
        return next({err});
    }
};

export const handleDeleteBlog = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        if(req.role !=='admin') throw new NotAuthorizedError();
        const foundBlog = await Blog.findById(req.params.blog_id);
        if(foundBlog!.author.toString() !== req.userId!.toString()) throw new NotAuthorizedError();
        foundBlog!.deleted = true;
        await foundBlog!.save();
        return res.status(200).json({ status:200, blog:foundBlog, msg:'Blog deleted successfully' });
    }catch(err){
        return next({err});
    }
};
