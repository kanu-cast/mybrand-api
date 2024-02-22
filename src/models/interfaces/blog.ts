import { Document, Types } from 'mongoose'

// This interface describes all properties a blog should have

export interface BlogAttrs {
    title: string;
    body: string;
    imageObj: {};
};

// this interface describes the properties a blog Document has

export interface BlogDoc extends Document {
    title: string;
    body: string;
    imageObj: {};
    likes:Types.ObjectId[];
    comments:Types.ObjectId[];
    author:Types.ObjectId;
    archived:boolean;
    deleted:boolean;
    createdAt:string;
    updatedAt:string;
};