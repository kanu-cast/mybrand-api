import { Document, Types } from 'mongoose'
import { Type } from 'typescript';

// This interface describes all properties a comment should have

export interface CommentAttrs {
    author:string;
    body: string

};

// this interface describes the properties a comment Document has

export interface CommentDoc extends Document {
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    suspended:string;
    blog:Types.ObjectId;
    likes:Types.ObjectId[];
    disLikes:Types.ObjectId[];
    role:string;
    lastActive:string;
    deleted:boolean;
    createdAt:string;
    updatedAt:string;
};