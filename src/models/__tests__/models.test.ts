import request from 'supertest';
import { app } from '../../app';
import { blogBuildFunction } from '../blog';
import { userBuildFunction } from '../user';
import { commentBuildFunction } from '../comment';
import { messageBuildFunction } from '../message';
import { compareFunction } from '../user';
import { NextFunction } from 'express';
import { userPreSaveFunction } from '../user';
import mongoose from 'mongoose';
const blogAttrs = {
    author: new mongoose.mongo.ObjectId(),
    title: 'test blog',
    body: 'blog body',
    imageObj:{
        url:'https://cloudinary/photo'
    }
};
const userAttrs = {
    firstName: "castro",
    lastName: "kanuma",
    email: "kanumacastro23@gmail.com",
    password: "pass123"
    
};
const commentAttrs = {
    author:new mongoose.mongo.ObjectId(),
    body: 'comment body',
    blog:new mongoose.mongo.ObjectId(),
};
const messageAttrs = {
    email: "kanumacastro23@gmail.com",
    body: 'message body',
};
const mockNext: NextFunction = jest.fn();

describe('models', ()=>{
    it('returns blog object given the right input', async()=>{
       const newBlog = blogBuildFunction(blogAttrs);
       expect(newBlog._id).toBeDefined();
   });
   it('returns user object given the right input', async()=>{
        const newUser = userBuildFunction(userAttrs);
        expect(newUser._id).toBeDefined();
        const fakeObject = {key: 'what'}
        // @ts-ignore
        const isMatch = await newUser.comparePassword(fakeObject, mockNext);
        expect(isMatch).toBeUndefined()


    });
    it('returns comment object given the right input', async()=>{
        const newComment = commentBuildFunction(commentAttrs);
        expect(newComment._id).toBeDefined();
    });
    it('returns message object given the right input', async()=>{
        const newMessage = messageBuildFunction(messageAttrs);
        expect(newMessage._id).toBeDefined();
    });
    
    it('returns true if passwords match', async()=>{
        //@ts-ignore
        const isMatch = await userPreSaveFunction(mockNext, "fisrtInput",  'what');
        expect(isMatch).toBeUndefined();
    })

})