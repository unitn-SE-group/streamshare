import router from 'app/register.js'
import express from 'express';
import User from './models/user';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use('/',router)

jest.mock('./models/user')

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
        //TODO wait for Daniele to finish this
        expect(res.body.message).toBe()
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com'});
        expect(User.prototype.save).not.toHaveBeenCalled();
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
            .post('/api/register')
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
})