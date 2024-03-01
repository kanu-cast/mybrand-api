import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import dotenv from "dotenv";
dotenv.config();

const passport = require('passport');
require('../passport-config')(passport);

import { authRoutes } from './routes/public/auth';
import { blogPublicRoutes } from './routes/public/blogs';
import { adminBlogRoutes } from './routes/admin/blogs';
import { publicMessageRoutes } from './routes/public/messages';
import { adminMessageRoutes } from './routes/admin/messages';
import { commentRoutes } from './routes/admin/comments';

import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { authorizeUser, checkIsUserAdmin } from './middleware';

const app = express();


app.use(passport.initialize()); 
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogPublicRoutes);
app.use('/api/messages', publicMessageRoutes);
app.use('/api/:blog_id/comments', passport.authenticate('jwt', { session: false }), authorizeUser, commentRoutes);
app.use('/api/blogs', passport.authenticate('jwt', { session: false }), checkIsUserAdmin, adminBlogRoutes);
app.use('/api/messages', passport.authenticate('jwt', { session: false }), checkIsUserAdmin, adminMessageRoutes);

app.all("*", ()=>{
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };