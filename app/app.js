const express = require('express');
const app = express();

const oauth = require('./oauth');

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/oauth', oauth);

module.exports = app;