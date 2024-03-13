import request from 'supertest';
import { app } from '../../../app';
import mongoose  from 'mongoose';

const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY as string;

const testImage = `${__dirname}/../../../../assets/coder.jpg`;
const updateImage = `${__dirname}/../../../../assets/coding.webp`;
const token = new mongoose.Types.ObjectId();

describe('Blogs', ()=>{
    
    it('creates new blog successfully if user is logged in', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
    })

    it('should return 200 if user tries to update a blog they own', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
        await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  updateImage)
        .expect(200);

    });

    it('should return 401 if user tries to update a blog they dont own', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);

        expect(response.body.token).toBeDefined();
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
        expect(blog.body.blog._id).toBeDefined();

        const wrongUser = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@testing.com',
            password: 'pass123'
        })
        .expect(201);

        expect(wrongUser.body.token).toBeDefined();

        const updatedBlog = await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/`)
        .set('Authorization', `Bearer ${wrongUser.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'updated blog')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  updateImage)
        .expect(401);

    });

    it('should return 200 if user tries to like a blog', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog  = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
        expect(blog.body.blog._id).toBeDefined();
        
        const like = await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200)
        expect(like.body.likes.length).toEqual(1);

        const reLike = await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200)
        expect(reLike.body.likes.length).toEqual(0);

    })

    it('should return 401 if user tries to delete a blog they own', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);

        expect(blog.body.blog._id).toBeDefined();

        await request(app)
        .delete(`/api/blogs/${blog.body.blog._id}/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(204)

        const allBlogs = await request(app)
        .get('/api/blogs/').expect(200);

        expect(allBlogs.body.blogs.length).toEqual(0);
    })

    it('should return 401 if user tries to delete a blog they dont own', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);

        expect(response.body.token).toBeDefined();
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
        expect(blog.body.blog._id).toBeDefined();

        const wrongUser = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@testing.com',
            password: 'pass123'
        })
        .expect(201);

        expect(wrongUser.body.token).toBeDefined();

        await request(app)
        .delete(`/api/blogs/${blog.body.blog._id}/`)
        .set('Authorization', `Bearer ${wrongUser.body.token}`)
        .expect(401)

        const allBlogs = await request(app)
        .get('/api/blogs/').expect(200);

    })

    it('should return 403 if blog validation fails title', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', '')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(403);
    });
    it('should return 403 if blog validation fails body', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum dolor')
        .field('body', '')
        .attach('uploadedImage',  testImage)
        .expect(403);
    });
    it('should return 403 if blog validation fails image', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
      
        const blog = await request(app)
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum dolor')
        .field('body', 'lorem ipsum dolor sit amet consectitum')
        .expect(403);
    });
})