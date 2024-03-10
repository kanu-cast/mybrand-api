import express, { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
const Joi = require('joi');

// Define a validation schema for user signup
const signupSchema = Joi.object({
    firstName:Joi.string().alphanum().min(3).max(30).required(),
    lastName:Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// Define a validation schema for blogs
const blogSchema = Joi.object({
    title:Joi.string().min(3).max(300).required(),
    body:Joi.string().min(3).max(3000).required()
});

// Define a validation schema for messages
const messageSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    body:Joi.string().min(10).max(3000).required(),
});

// Define a validation schema for comments
const commentSchema = Joi.object({
    body:Joi.string().min(3).max(500).required(),
});

// Define a validation schema for user signin
const signinSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// validate middleware for signup
export const validateSignup = async(req:Request, res:Response, next:NextFunction)=>{ 
    const { error, value } = signupSchema.validate(req.body);
    if (error)  return next(new RequestValidationError(error));
    next();
};

// validate middleware for signin
export const validateSignin = async(req:Request, res:Response, next:NextFunction)=>{ 
    const { error, value } = signinSchema.validate(req.body);
    if (error)  return next(new RequestValidationError('Invalid Email/Password Combination'));
    next();
};

// validate middleware for blogs
export const validateBlog = async(req:Request, res:Response, next:NextFunction)=>{ 
    const { error, value } = blogSchema.validate(req.body);
    if (error)  return next(new RequestValidationError(error));
    next();
};

// validate middleware for comment
export const validateComment = async(req:Request, res:Response, next:NextFunction)=>{ 
    const { error, value } = commentSchema.validate(req.body);
    if (error)  return next(new RequestValidationError(error));
    next();
};

// validate middleware for message
export const validateMessage = async(req:Request, res:Response, next:NextFunction)=>{ 
    const { error, value } = messageSchema.validate(req.body);
    if (error)  return next(new RequestValidationError('Email/Message Validation Failed'));
    next();
};
