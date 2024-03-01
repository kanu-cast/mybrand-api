import request from 'supertest';
import { app } from '../../../app';

describe('Messages', ()=>{
    it('should return 201 on successfull message sent', async()=>{
        await request(app)
        .post('/api/messages/create')
        .send({
            email: 'test@testing.com',
            body:"lorem ipsum dolor"
        })
        .expect(201);

        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);

        return request(app)
        .get('/api/messages/read/all')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
    });
    it('should return 200 on successfull message retrieval', async()=>{
        const message = await request(app)
        .post('/api/messages/create')
        .send({
            email: 'test@testing.com',
            body:"lorem ipsum dolor"
        })
        .expect(201);

        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
        expect(message.body.message._id).toBeDefined();

        return request(app)
        .get(`/api/messages/${message.body.message._id}/read`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
    });

    it('should return 400 on unsuccessfull message retrieval', async()=>{
        await request(app)
        .post('/api/messages/create')
        .send({
            email: 'test@testing.com',
            body:"lorem ipsum dolor"
        })
        .expect(201);

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

        return request(app)
        .get(`/api/messages/65de45932d129d8e7ebf8eb2/read`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(400);
    });
    it('should return 200 on successfull message deletion', async()=>{
        
        const message = await request(app)
        .post('/api/messages/create')
        .send({
            email: 'test@testing.com',
            body:"lorem ipsum dolor"
        })
        .expect(201);
        
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
        expect(message.body.message._id).toBeDefined();
        await request(app)
        .put(`/api/messages/${message.body.message._id}/delete`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
        
        const allMessages = await request(app)
        .get('/api/messages/read/all')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);

        expect(allMessages.body.messages.length).toEqual(0);

    });
});