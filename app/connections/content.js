import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// select db to connect to based on the environment
let content_connection;
if (process.env.NODE_ENV !== 'test') {
    content_connection = mongoose.createConnection(process.env.MONGO_CONTENT_URI);
    content_connection.on('error', console.error.bind(console, 'MongoDB content database connection error:'));
    content_connection.once('open', function() {
      console.log("Connected to MongoDB content database!");
    });
} else {
    content_connection = mongoose.createConnection(process.env.MONGO_TEST_URI);
    content_connection.on('error', console.error.bind(console, 'MongoDB test database connection error:'));
    content_connection.once('open', function() {
      console.log("Connected to MongoDB test database!");
    });
}

export default content_connection;