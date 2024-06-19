import express from 'express';
const app = express();
import authentication from './authentication.js';
import cookieParser from 'cookie-parser';

app.use(cookieParser());
/**Add a middleware in order to parse the data in a json */
app.use(express.json());

app.use('/auth', authentication);

module.exports = app;