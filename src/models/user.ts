import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { UserAttrs, UserDoc } from "./interfaces/user";
import bcrypt from 'bcrypt';
import { BadRequestError } from "../errors/bad-request-error";
import { NextFunction } from "express";

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default: 'admin'
    },
    blogs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    suspended:{
        type:Boolean,
        default: false
    },
    deleted:{
        type:Boolean,
        default: false
    },
    lastActive:{
        type: String
    }

}, {timestamps: true});

// Schema hooks
userSchema.pre("save", userPreSaveFunction)

export async function userPreSaveFunction (this: any, next){
    try{
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }catch(err:any){
        return next(err);
    }
}
// Schema methods
export const compareFunction = userSchema.methods.comparePassword = async function(candidatePassword, next:NextFunction) {
    try {
      let isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      return next(err);
    }
};

export const userBuildFunction = userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs);
};
userSchema.plugin(uniqueValidator,{message: 'Email registered under another User'});
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };