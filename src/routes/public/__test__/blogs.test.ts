import request from 'supertest';
import { app } from '../../../app';
const testImage = `${__dirname}/../../../../assets/coder.jpg`;

describe('blogs unprotected routes', ()=>{
    it('should return 200 with all blogs', async()=>{
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
        .get('/api/blogs/read/all')
        .expect(200);
    })
    it('should return 200 with single blog', async()=>{
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
        .get(`/api/blogs/${blog.body.blog._id}/read`)
        .expect(200);
    })

    it('should return 400 if blog not found', async()=>{
        request(app)
        .get('/api/blogs/65de45932d129d8e7ebf8eb2/read')
        .expect(400);
    })
})