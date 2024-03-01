import request from 'supertest';
import { app } from '../../../app';
const testImage = `${__dirname}/../../../../assets/coder.jpg`;

describe('comments on blogs', ()=>{
    it('should return 200 on user create new comment', async()=>{
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
        .post(`/api/${blog.body.blog._id}/comments/create`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({
            body:"lorem ipsum"
        })
        .expect(201)
        
        await request(app)
        .get('/api/blogs/read/all')
        .expect(200);
    });
    it('should return 200 on user likes comment', async()=>{
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
        
        const comment = await request(app)
        .post(`/api/${blog.body.blog._id}/comments/create`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({
            body:"lorem ipsum"
        })
        .expect(201)
        
        await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);

        await request(app)
        .get('/api/blogs/read/all')
        .expect(200);


    });
    it('should return 200 on disliking comment', async()=>{
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
        
        const comment = await request(app)
        .post(`/api/${blog.body.blog._id}/comments/create`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({
            body:"lorem ipsum"
        })
        .expect(201)
        
        await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/dislike`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200)

        await request(app)
        .get('/api/blogs/read/all')
        .expect(200);


    });
    it('should return 200 on switching like and dislike reactions', async()=>{
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
        
        const comment = await request(app)
        .post(`/api/${blog.body.blog._id}/comments/create`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({
            body:"lorem ipsum"
        })
        .expect(201)
        
        const like = await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
        expect(like.body.comments[0].likes.length).toEqual(1);

        const dislike = await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/dislike`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
        expect(dislike.body.comments[0].disLikes.length).toEqual(1);
        expect(dislike.body.comments[0].likes.length).toEqual(0);

        const relike = await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/like`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
        expect(relike.body.comments[0].disLikes.length).toEqual(0);
        expect(relike.body.comments[0].likes.length).toEqual(1);

        const reDislike = await request(app)
        .put(`/api/${blog.body.blog._id}/comments/${comment.body.blog.comments[0]._id}/dislike`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
        expect(reDislike.body.comments[0].disLikes.length).toEqual(1);
        expect(reDislike.body.comments[0].likes.length).toEqual(0);

        await request(app)
        .get('/api/blogs/read/all')
        .expect(200);

    });
    it('should return 400 if comment validation fails', async()=>{
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
        .post(`/api/${blog.body.blog._id}/comments/create`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .send({
            body:"l"
        })
        .expect(400)
    })
})