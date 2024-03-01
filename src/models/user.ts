import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { UserAttrs, UserDoc } from "./interfaces/user";
import { NextFunction } from "express";
import bcrypt from 'bcrypt';

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
userSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }catch(err:any){
        return next(err);
    }
});

// Schema methods
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
      let isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
        console.log(err);
      return next(err);
    }
};

userSchema.plugin(uniqueValidator,{message:"Email is already registered under another user"});
userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };