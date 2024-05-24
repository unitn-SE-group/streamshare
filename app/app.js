const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./models/User");
const dotenv = require('dotenv');

const router = express.Router();
router.use(express.json());
dotenv.config();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists in the database
        // const existingUser = await User.findOne({ username });
        // if (existingUser) {
        //     return res.status(409).json({ message: "User already exists" });
        // }

        // // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // // Create a new user object
        // const newUser = new User({
        //     username,
        //     password: hashedPassword
        // });

        // // Save the new user to the database
        // await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const app = express();
app.use('/', router);
app.listen(3000);