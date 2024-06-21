import User from '../app/models/user';
import request from 'supertest';
import app from '../app/app';

describe('POST /auth/register', () => {
    /**
     * Send a POST request to the API endpoint with an object containing the required information
     * to create a new user. In this test cases the user does not exist yet in the database.
     */
    it('should create a new user if the user does not already exist', async () => {
        const res = await request(app)
        .post('/auth/register')
        .send({
            createdWith: 'local',
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: true,
            password: 'password123',
            birthDay: '1990-01-01',
        });

        expect(res.status).toBe(201);
        expect(res.body).toStrictEqual({
            "message": "User created successfully",
            "redirect_url": "/login"
        });
    });

     /**
     * Send a POST request to the API endpoint with an object containing the required information
     * to create a new user. In this test cases the user already exists in the database.
     */
     it('should return 409 if the user already exists', async () => {
        await User.create({
            createdWith: 'local',
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: true,
            password: 'password123',
            birthDay: '1990-01-01',
        });

        const res = await request(app)
            .post('/auth/register')
            .send({
            createdWith: 'local',
            userType: 'consumer',
            email: 'test@example.com',
            FirstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            gender: true,
            password: 'password123',
            birthDay: '1990-01-01',
            });

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('User already exists');
    });
});