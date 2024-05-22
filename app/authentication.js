const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./User")

const app = express();
/**Add a middleware in order to parse the data in a json */
app.use(express.json())



mongoose.connect(
    "mongodb+srv://davide:StreamShare@production.vj0vnfe.mongodb.net/?retryWrites=true&w=majority&appName=Production",
)
.then(()=> console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

const PORT = 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})

/**Add an endpoint */
app.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    console.log(`The email is: ${email}`)
    console.log(`The password is: ${password}`)

    if (!email || !password){
        return res.sendStatus(400).json({error: `Invalid name or password`}) //Bad Request
    }

    try{
        //search for the email in the database
        const user = await User.find({email: `${password}`})
        if(!user){
            return res.sendStatus(404).json({error: `Account not registered`}) //Not Found
        }

        //control if the password is correct
        const password_match = await bcrypt.compare(password, existing_user.password)
        if(!password_match){
            return res.sendStatus(401).json({error: `Invalid password`}) //Unauthorizied
        }

        //generate JWT token
        const payload = {username: user.username, email: user.email}
        const key_acc = process.env.ACCESS_TOKEN_SECRET
        const key_ref = process.env.REFRESH_TOKEN_SECRET
        const options = {expiresIn: '30m'}
        const accessToken = jwt.sign(payload, key_acc, options)
        const refreshToken = jwt.sign(payload, key_ref)


        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })

    }catch(err){
        console.log(`An error occoured during authentication: ${err}`)
    }
})




