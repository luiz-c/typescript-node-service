import * as supertest from 'supertest';
import server from './server';

describe('Server', () => {
  it('works', () => supertest(server)
    .get('/')
    .expect('Content-Type', /json/)
    .expect(200));
});
