import request from 'supertest';
import { app } from '../../../app';

describe('Messages', ()=>{
    it('should return 200 on successfull message sent', async ()=>{
        await request(app)
        .post('/api/messages/')
        .send({
            email: 'test@testing.com',
            body:"lorem ipsum dolor"
        })
        .expect(201);
     
    })
    it('should return 400 on invalid email', ()=>{
        
        return request(app)
        .post('/api/messages/')
        .send({
            email: 'testtesting.com',
            body:"lorem ipsum dolor"
        })
        .expect(403)
    })
   
});