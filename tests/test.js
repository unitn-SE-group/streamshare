const request = require('supertest');
const app = require('../app/authentication'); 
const http = require('http');

let server;

beforeAll(done => {
  server = http.createServer(app);
  server.listen(done);
});

afterAll(done => {
  server.close(done);
});

describe('POST /api/login', () => {
  it('should respond with a 200 status and an object containing access and refresh tokens', async () => {
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'conigliofelice'
    };
    const response = await request(server)
      .post('/api/login')
      .send(loginData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  }, 10000); 

  it('should respond with a 401 status for wrong password', async () => {
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'conigliotriste'
    };
    const response = await request(server)
      .post('/api/login')
      .send(loginData);
    expect(response.status).toBe(401);
  }, 10000); 
});






