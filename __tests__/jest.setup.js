import mongoose from 'mongoose';
import {User, Session} from '../app/connections/accounts.js';

let mongoServer;

beforeAll(async () => {
    
});

afterAll(async () => {
    // drop the database
    await mongoose.connect(process.env.MONGO_TEST_URI);
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_TEST_URI);
});

afterEach(async () => {
    await mongoose.connection.close();
});