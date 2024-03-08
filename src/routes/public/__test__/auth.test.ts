import request from 'supertest';
import { app } from '../../../app';

describe('authentication', ()=>{
    describe('signup', ()=>{
    
        it('returns a 201 on successful signup', async()=>{
            return request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
        })
        
        it('restrains duplicate email signup', async()=>{
        
            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
        
            return request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(500);
        })
        
        it('returns a 400 on invalid email', async()=>{
            return request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'testtestcom',
                password: 'pass123'
            })
            .expect(403);
        })
        
        it('returns a 400 on invalid firstName and/or lastname', async()=>{
        
            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"k",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(403);
        
            return request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: '12',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(403);
        
        })
        
        it('returns a 400 on invalid password', async()=>{
            return request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'p@'
            })
            .expect(403);
        })
        
        it('checks if token was assigned to user', async()=>{
            const response = await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            }).expect(201);
            expect(response.body.token).toBeDefined();
        
        })
    });

    describe('signin', ()=>{

        it('returns a 200 on successful signin', async()=>{

            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
        
            return request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(200);
        })
        
        it('returns a 400 on if user is not found', async()=>{
        
            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201)
        
            return request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@testing.com',
                password: 'pass123'
            })
            .expect(400);
        })
        
        it('returns a 400 if user provides wrong password', async()=>{
        
            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@castillo.com',
                password: 'pass123'
            })
            .expect(201);
        
            return request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@castillo.com',
                password: 'pass1'
            })
            .expect(400);
        
        })
        
        it('returns a 400 on invalid password', async()=>{
            return request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'p@'
            })
            .expect(403);
        })
        
        it('checks if token was assigned to user', async()=>{
        
            await request(app)
            .post('/api/auth/signup')
            .send({
                firstName:"kanu",
                lastName: 'castro',
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
        
            const response = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            }).expect(200);
            expect(response.body.token).toBeDefined();
        
        })
        
    });

});
