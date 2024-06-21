import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../models/user.js'
import sessionSchema from '../models/session.js';

dotenv.config();

const accounts_connection = mongoose.createConnection(process.env.MONGO_ACCOUNTS_URI);
accounts_connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
accounts_connection.once('open', function() {
  console.log("Connected to MongoDB!");
});


const User = accounts_connection.model('User', userSchema);
const Session = accounts_connection.model('Session', sessionSchema);

export { User, Session };