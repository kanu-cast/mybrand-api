import { Document, Types } from 'mongoose'

// This interface describes all properties a message should have

export interface MessageAttrs {
    email: string;
    body: string;
};

// this interface describes the properties a message Document has

export interface MessageDoc extends Document {
    email:string;
    body:string;
    deleted:boolean;
    createdAt:string;
    updatedAt:string;
};