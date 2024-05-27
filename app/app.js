const express = require('express')
const app = express()
const registration = require('./register.js')

app.use(express.json())
app.use('/register', registration)
module.exports = app
