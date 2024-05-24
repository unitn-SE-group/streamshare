const express = require('express');
const app = express();
const authentication = require('./authentication.js');


/**Add a middleware in order to parse the data in a json */
app.use(express.json());

app.use('/auth', authentication);

module.exports = app;