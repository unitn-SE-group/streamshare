import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const test_connection = mongoose.createConnection(process.env.MONGO_TEST_URI);

export default test_connection;