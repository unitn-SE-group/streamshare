import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
    
});

afterAll(async () => {
    // drop the database
    await mongoose.connection.dropDatabase();
});

beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
    await mongoose.connection.close();
});