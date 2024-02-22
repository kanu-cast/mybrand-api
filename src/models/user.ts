import mongoose from "mongoose";
import bcrypt from "bcrypt";
import uniqueValidator from 'mongoose-unique-validator';
import { UserAttrs, UserDoc } from "./interfaces/user";
import { Password } from "../services/password";
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
        require:true
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
userSchema.pre("save", async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password')!);
        this.set('password', hashed);
    }
    done();
});

// Schema methods
userSchema.methods.comparePassword = async function(candidatePassword:string, next:NextFunction) {
    try {
      let isMatch = await Password.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
        console.log(err);
      return next(err);
    }
};

userSchema.plugin(uniqueValidator,{message:"email is already registered under another user"});
userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };