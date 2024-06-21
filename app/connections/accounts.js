import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../models/user.js'
import sessionSchema from '../models/session.js';

dotenv.config();

const accounts_connection = mongoose.createConnection(process.env.MONGO_ACCOUNTS_URI);
accounts_connection.model('User', userSchema);
accounts_connection.model('Session', sessionSchema);

export default accounts_connection;