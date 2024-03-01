import request from 'supertest';
import { app } from '../../../app';

const testImage = `${__dirname}/../../../../assets/coder.jpg`;
const updateImage = `${__dirname}/../../../../assets/coding.webp`;
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
        .post('/api/blogs/create')
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
        .post('/api/blogs/create')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);
        
        await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/update`)
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
        .post('/api/blogs/create')
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
        .put(`/api/blogs/${blog.body.blog._id}/update`)
        .set('Authorization', `Bearer ${wrongUser.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'updated blog')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  updateImage)
        .expect(400);

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
        .post('/api/blogs/create')
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
        expect(like.body.blog.likes.length).toEqual(1);

        const reLike = await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200)
        expect(reLike.body.blog.likes.length).toEqual(0);

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
        .post('/api/blogs/create')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(201);

        expect(blog.body.blog._id).toBeDefined();

        await request(app)
        .put(`/api/blogs/${blog.body.blog._id}/delete`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200)

        const allBlogs = await request(app)
        .get('/api/blogs/read/all').expect(200);

        expect(allBlogs.body.blogs.length).toEqual(0);
    })

    it('should return 400 if user tries to delete a blog they dont own', async()=>{
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
        .post('/api/blogs/create')
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
        .put(`/api/blogs/${blog.body.blog._id}/delete`)
        .set('Authorization', `Bearer ${wrongUser.body.token}`)
        .expect(400)

        const allBlogs = await request(app)
        .get('/api/blogs/read/all').expect(200);

        expect(allBlogs.body.blogs.length).toEqual(1);
    })

    it('should return 400 if blog validation fails title', async()=>{
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
        .post('/api/blogs/create')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', '')
        .field('body', 'lorem ipsum dolor')
        .attach('uploadedImage',  testImage)
        .expect(400);
    });
    it('should return 400 if blog validation fails body', async()=>{
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
        .post('/api/blogs/create')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum dolor')
        .field('body', '')
        .attach('uploadedImage',  testImage)
        .expect(400);
    });
    it('should return 400 if blog validation fails image', async()=>{
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
        .post('/api/blogs/create')
        .set('Authorization', `Bearer ${response.body.token}`)
        .set('contentType', 'application/octet-stream')
        .field('title', 'lorem ipsum dolor')
        .field('body', '')
        .attach('uploadedImage', '')
        .expect(400);
    });
})