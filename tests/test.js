const request = require('supertest');
const app = require('./authentication.js'); 

describe('POST /api/login', () => {
  it('should respond with a 200 status and an object containing access and refresh tokens', async () => {
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'conigliofelice'
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should respond with a 401 status for wrong password', async () => {
    const loginData = {
      email: 'daniele.pedrolli@studenti.unitn.it',
      password: 'conigliotriste'
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', `Invalid password`);
  });

  
});






