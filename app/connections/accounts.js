import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userSchema from '../models/user.js'
import sessionSchema from '../models/session.js';

dotenv.config();

// select db to connect to based on the environment
let accounts_connection = null;
if (process.env.NODE_ENV !== 'test') {
  accounts_connection = mongoose.createConnection(process.env.MONGO_ACCOUNTS_URI);
  accounts_connection.on('error', console.error.bind(console, 'MongoDB account database connection error:'));
  accounts_connection.once('open', function() {
    console.log("Connected to MongoDB accounts database!");
  });
} else {
  accounts_connection = mongoose.createConnection(process.env.MONGO_TEST_URI);
  accounts_connection.on('error', console.error.bind(console, 'MongoDB test database connection error:'));
  accounts_connection.once('open', function() {
    console.log("Connected to MongoDB test database!");
  });
}


const User = accounts_connection.model('User', userSchema);
const Session = accounts_connection.model('Session', sessionSchema);

export { User, Session };