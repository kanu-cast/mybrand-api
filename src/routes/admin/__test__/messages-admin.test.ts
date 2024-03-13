import request from 'supertest';
import { app } from '../../../app';

describe('Messages', ()=>{
    it('should return 201 on successfull message sent', async()=>{
        await request(app)
        .post('/api/messages/')
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
        .get('/api/messages/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
    });
    it('should return 200 on successfull message retrieval', async()=>{
        const message = await request(app)
        .post('/api/messages/')
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
        .get(`/api/messages/${message.body.message._id}/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);
    });

    it('should return 400 on unsuccessfull message retrieval', async()=>{
        await request(app)
        .post('/api/messages/')
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
        .get(`/api/messages/65de45932d129d8e7ebf8eb2/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(404);
    });
    it('should return 200 on successfull message deletion', async()=>{
        
        const message = await request(app)
        .post('/api/messages/')
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
        .delete(`/api/messages/${message.body.message._id}/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(204);
        
        const allMessages = await request(app)
        .get('/api/messages/')
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(200);

        expect(allMessages.body.messages.length).toEqual(0);

    });
    it('should not delete if message_id is invalid', async()=>{
        const response = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
        expect(response.body.token).toBeDefined()

        await request(app)
        .delete(`/api/messages/65de45932d129d8e7ebf8eb2/`)
        .set('Authorization', `Bearer ${response.body.token}`)
        .expect(404);
    })
});