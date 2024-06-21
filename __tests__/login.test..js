import User from '../app/models/user.js';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app/app.js';

describe('POST /auth/login', () => {

    it('should respond with a 200 status and an object containing access and refresh tokens for existing user', async () => {
        const passwordHash = await bcrypt.hash('password',10);
        User.create({
            createdWith: 'local',
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: true,
            password: passwordHash,
            birthDay: '1990-01-01',
        });

        const loginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'password'
        };

        const res = await request(app).post('/auth/login').send(loginData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('should respond with a 401 status for wrong password or non-existing user', async () => {
        const passwordHash = await bcrypt.hash('password',10);
        User.create({
            createdWith: 'local',
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: true,
            password: passwordHash,
            birthDay: '1990-01-01',
        });

        const wrongLoginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'conigliotriste'
        };
        const res = await request(app).post('/auth/login').send(wrongLoginData);
        expect(res.status).toBe(401);
    });
});