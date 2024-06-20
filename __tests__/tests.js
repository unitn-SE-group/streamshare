import router from '../app/register.js';
import express from 'express';
import User from '../app/models/user';
import request from 'supertest';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../app/models/user');

describe('POST /register', () => {
    beforeEach(() => {
        User.findOne.mockClear();
        User.mockClear();
    })

    /**
     * Send a POST request to the API endpoint with an object containing the required information
     * to create a new user. In this test cases the user does not exist yet in the database.
     */
    it('should create a new user if the user does not already exist', async () => {
        User.findOne.mockResolvedValue(null);
        User.prototype.save.mockResolvedValue({});
        
        const res = await request(app)
        .post('/register')
        .send({
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: 'male',
            password: 'password123',
            birthDay: '1990-01-01',
        });

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual({
            "message": "User created successfully",
            "redirect_url": "/login"
        })
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'});
        expect(User.prototype.save).toHaveBeenCalled();
    });

     /**
     * Send a POST request to the API endpoint with an object containing the required information
     * to create a new user. In this test cases the user already exists in the database.
     */
     it('should return 409 if the user already exists', async () => {
        User.findOne.mockResolvedValue({
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: 'male',
            password: 'password123',
            birthDay: '1990-01-01',
        });

        const res = await request(app)
            .post('/register')
            .send({
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: 'male',
            password: 'password123',
            birthDay: '1990-01-01',
            });

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('User already exists');
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(User.prototype.save).not.toHaveBeenCalled();
    });
});

describe('POST /login', () => {

    it('should respond with a 200 status and an object containing access and refresh tokens for existing user', async () => {
        User.findOne.mockResolvedValue({
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: bcrypt.hash('password',10) // Hash for 'conigliofelice'
        });
        User.prototype.save.mockResolvedValue();
        const loginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'password'
        };

        const res = await request(app).post('/login').send(loginData);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('should respond with a 401 status for wrong password', async () => {
        const wrongLoginData = {
            email: 'daniele.pedrolli@studenti.unitn.it',
            password: 'conigliotriste'
        };
        const res = await request(app).post('/login').send(wrongLoginData);
        expect(res.status).toBe(401);
    });

    it('should respond with a 401 status for non-existing user', async () => {
        const nonExistentUserData = {
            email: 'non.existent@studenti.unitn.it',
            password: 'anyPassword'
        };
        const res = await request(app).post('/login').send(nonExistentUserData);
        expect(res.status).toBe(401);
    });
});