import request from 'supertest';
import { app } from '../../../app';

describe('covering all bases', ()=>{
    it('should return 404 not found on any unexisting route', async()=>{
        return request(app)
        .get('/api/nothing')
        .expect(404);
    });
})