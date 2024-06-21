import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const content_connection = mongoose.createConnection(process.env.MONGO_CONTENT_URI);

export default content_connection;