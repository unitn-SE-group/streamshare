import router from '../app/authentication.js';
import express from 'express';
import User from '../app/models/user.js';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use('/',router)

jest.mock('../app/models/user')


describe('POST /auth/login', () => {
    beforeAll(() => {
        User.addOne(
            {
                email: 'daniele.pedrolli@studenti.unitn.it',
                password: 'conigliofelice'
            }
        );
    })
    afterAll(() => {
        User.mockClear();
    })
    it('should respond with a 200 status and an object containing access and refresh tokens', async () => {
        const loginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'conigliofelice'
        };
        const res = await request(app).post('/auth/login').send(loginData)
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });
    it('should respond with a 401 status for wrong password', async () => {
        const wrongLoginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'conigliotriste'
        };
        const res = await request(app).post('/auth/login').send(wrongLoginData)
        expect(response.status).toBe(401);
    });
})


