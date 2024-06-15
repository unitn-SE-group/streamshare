const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./models/User");
const Session = require("./models/Session");
const dotenv = require('dotenv');

const express = require('express');
const router = express.Router();

dotenv.config();

/**
 * @fileoverview Authentication API
 */

/**
 * POST /auth/login
 * 
 * @description This endpoint authenticates a user and returns an Access Token that can be used for subsequent API requests and a Refresh Token.
 * 
 * @method POST
 * 
 * @endpoint_url https://api.yourservice.com/auth/login
 * 
 * @request_header 
 * 
 * @request_body The request body should be a JSON object containing the user's credentials: email and password.
 * 
 * @param {string} email The email of the user 
 * 
 * @param {string} password The password of the user
 * 
 * @example {json} Example Request:
 *    {
 *      "email": "user@example.com",
 *      "password": "yourpassword"
 *    }
 * 
 * @example {json} Example Success Response:
 *    {
 *      "RefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *      "AccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI7gH8Trdua..."
 *    }
 * 
 * @example {json} Example Error Response (400):
 *    {
 *      "error": "Invalid request. Username and password are required."
 *    }
 * 
 * @example {json} Example Error Response (401):
 *    {
 *      "error": "Invalid password."
 *    }
 * 
 * @example {json} Example Error Response (404):
 *    {
 *      "error": "Account not registered"
 *    }
 * 
 * @example {json} Example Error Response (500):
 *    {
 *      "error": "An unexpected error occurred. Please try again later."
 *    }
 * 
 * @example {curl} Example Usage:
 *    curl -X POST https://api.yourservice.com/api/login \
 *         -H "Content-Type: application/json" \
 *         -d '{"email": "user@example.com", "password": "yourpassword"}'
 */
router.post(`/login`, async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    let hased = await bcrypt.hash(password, 10)
    console.log(`${hased}`)
    if (!email || !password){
        return res.status(400).json({error: `Invalid request. Username and password are required.`}); //Bad Request
    }

    try{
        //search for the email in the database
        const user = await User.findOne({email: email} );

        //Verify if the accout exists
        if(!user) return res.status(404).json({error: `Account not registered`}) //Not Found

        //control if the password is correct
        const password_match = await bcrypt.compare(password, user.password)
        if(!password_match){
            return res.status(401).json({error: `Invalid password`}) //Unauthorizied
        }

        //generate JWT token
        const payload = {_id: user._id , username: user.username, email: user.email}
        const key_acc = process.env.ACCESS_TOKEN_SECRET
        const key_ref = process.env.REFRESH_TOKEN_SECRET
        const options = {expiresIn: '2000s'}
        const accessToken = jwt.sign(payload, key_acc, options)
        const refreshToken = jwt.sign(payload, key_ref)

        //Update and save the session schema in the database
        const newSession = new Session({
            user_id: user._id,
            refreshToken: refreshToken,
            accessToken: accessToken 
        })
        await newSession.save();

        //Setting the Tokens in the cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

        //Returning the tokens
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })

        console.log(`The user -${user.username}- is succesfully logged in!`);

    }catch(err){
        console.log(`An error occoured during authentication: ${err}`)
        res.status(500)
    }
})



/**
 * POST /auth/logout
 * 
 * @description This endpoint logs out a user
 * 
 * @method DELETE
 * 
 * @endpoint_url https://api.yourservice.com/auth/logout
 * 
 * There is no example since the informatino needed from the logout are taken from the cookies
 */
router.delete('/logout', authenticateToken, async (req, res) => {
    try{
        //delete the session from the database
        const session = await Session.deleteMany( {user_id: req.user._id} );

        //delete the Tokens from the cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    
        res.status(204).json(session._id)

        console.log(`The user -${req.user.username}- has succesfully logged out!`)

    }catch(err){
        console.log(`An error occoured during logout: ${err}`)
        res.status(500)
    }
    
})



/**
 * POST /auth/posts
 * 
 * @description This endpoint authenticates a user and returns a content requested from the platfotm
 *  
 * @method GET
 * 
 * @endpoint_url https://api.yourservice.com/auth/posts
 
 * The endpoint will be updated when the user stories about asking for an object will be implemented
 */
router.get('/posts', authenticateToken, async (req, res) =>{
    try{
        //Search what the User wants
        const user = await User.findOne( {email: req.user.email} );
    
        res.json(user.username)

        console.log(`The user -${req.user.username}- has succesfully received data from the web-site!`)

    }catch(err){
        console.log(`An error occoured during requesting data: ${err}`)
        res.status(500)
    }
    
})



/**
 * POST /auth/token
 * 
 * @description This endpoint generates a new accessToken for the user
 * 
 * @method POST
 * 
 * @endpoint_url https://api.yourservice.com/auth/token
 * 
 * 
 * There is no example since the argumenti passing is done through cookies.
 */
router.post('/token', async (req, res)=>{
    try{
        //take the token from the cookies and check whether it exists
        const refreshToken = req.cookies.refreshToken 
        if (refreshToken == null) return res.sendStatus(401)
    
        //Find the session the refresh Token is associated with 
        const session = await Session.findOne({ refreshToken: { $in: [`${refreshToken}`] } })
        if (!session) return res.sendStatus(403)
    
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
            if (err) return res.sendStatus(403)
    
            //create new accessToken and save it in the session on the DB and in the cookies
            const payload = {_id: user._id, username: user.username, email: user.email}
            const key_acc = process.env.ACCESS_TOKEN_SECRET
            const key_ref = process.env.REFRESH_TOKEN_SECRET
            const options = {expiresIn: '2000s'}
            const accessToken = jwt.sign(payload, key_acc, options)
    
            session.accessToken = accessToken
            session.save();
    
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        
            res.json({ accessToken: accessToken})

            console.log(`The user -${user.username}- has succesfully received a new token!`)
        })
    }catch(err){
        console.log(`An error occoured during requesting new token: ${err}`)
        res.status(500)
    }
    
})



/**MIDDLEWARE TO AUTHENTICATE THE TOKEN*/
function authenticateToken(req, res, next) {
    try{
        //take the access Token from the cookies if exists
        const token = req.cookies.accessToken;

        if (!token) {
            return res.sendStatus(401);
        }
    
        //check whether the token is correct
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });

    }catch(err){
        console.log(`An error occoured during token authentication: ${err}`)
        res.status(500)
    }
    
}


module.exports = router;