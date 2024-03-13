import request from 'supertest';
import { app } from '../../../app';

describe('Users', ()=>{
    it('returns a 200 on successful user retriaval', async()=>{
        const newUser = await request(app)
        .post('/api/auth/signup')
        .send({
            firstName:"kanu",
            lastName: 'castro',
            email: 'test@test.com',
            password: 'pass123'
        })
        .expect(201);
        expect(newUser.body.token).toBeDefined();

        const allUsers = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${newUser.body.token}`)
        .expect(200);

        expect(allUsers.body.users.length).toEqual(1);
    });
});