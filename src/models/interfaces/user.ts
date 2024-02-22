import { Document, Types } from 'mongoose'

// This interface describes all properties a user should have

export interface UserAttrs {
    firstName: string;
    lastName: string;
    email: string;
    password:string;
};

// this interface describes the properties a User Document has

export interface UserDoc extends Document {
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    suspended:string;
    blogs:Types.ObjectId[];
    role:string;
    lastActive:string;
    deleted:boolean;
    createdAt:string;
    updatedAt:string;
    comparePassword(candidatePassword: string): Promise<boolean>;
};