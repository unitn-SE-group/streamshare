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
 * auth/login
 * 
 * @description This endpoint authenticates a user and returns an Access Token that can be used for subsequent API requests and a Refresh Token.
 * 
 * @method POST
 * 
 * @endpoint_url https://api.yourservice.com/auth/login
 * 
 * 
 * 
 * @request
 *      @Request_Header 
 * 
 *      @Request_Body The request body should be a JSON object containing the user's credentials: email and password.
 *          @param {string} email The email of the user 
 *          @param {string} password The password of the user
 * 
 *          @example {json}:
 *              {
 *                  "email": "user@example.com",
 *                  "password": "yourpassword"
 *              }
 * 
 * 
 * 
 * @responses
 *      @SuccessResponse
 *          @example {json} (200):
 *          @description The user has inserted the right email and username and is given back with the tokens
 *              {
 *                 "RefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *                 "AccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI7gH8Trdua...",
 *                 "UserType": "admin\creator\user"
 *              }
 * 
 *      @ErrorResponse
 *          @example {json} (400):
 *          @description The user has inserted an invalis request: both Username and Password are required
 *              {
 *                  "error": "Invalid request. Username and password are required."
 *              }
 * 
 *          @example {json} (401):
 *          @description The user has inserted an invalid password
 *              {
 *                  "error": "Invalid password."
 *              }
 * 
 *          @example {json} (404):
 *          @description The user has inserted an invalid email
 *              {
 *                  "error": "Account not registered."
 *              }
 * 
 *          @example {json} (500):
 *          @description The served has had some problems during login
 *              {
 *                  "error": "An error occured during login."
 *              }
 * 
 * 
 * 
 * @usage
 *      @example {curl} Example Usage:
 *          curl -X POST https://api.yourservice.com/auth/login \
 *               -H "Content-Type: application/json" \
 *               -d '{"email": "user@example.com", "password": "yourpassword"}'
 * 
 * 
 */
router.post(`/login`, async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password){
        return res.status(400).json({error: `Invalid request. Username and password are required.`}); //Bad Request
    }

    try{
        //Search for the account in the database
        const user = await User.findOne({email: email} );

        if(!user){
            return res.status(404).json({error: `Account not registered`}); //Not Found
        }

        //Check is the password is correct
        const password_match = await bcrypt.compare(password, user.password);

        if(!password_match){
            return res.status(401).json({error: `Invalid password`}) //Unauthorizied
        }

        //Generate JWT token
        const payload = {_id: user._id, username: user.username, email: user.email};
        const key_acc = process.env.ACCESS_TOKEN_SECRET;
        const key_ref = process.env.REFRESH_TOKEN_SECRET;
        const options = {expiresIn: '2000s'};
        const accessToken = jwt.sign(payload, key_acc, options);
        const refreshToken = jwt.sign(payload, key_ref);

        //Update and save the session schema in the database
        const newSession = new Session({
            user_id: user._id,
            refreshToken: refreshToken,
            accessToken: accessToken 
        });
        await newSession.save();

        //Setting the Tokens in the cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

        console.log(`The user -${user.username}- is succesfully logged in!`);

        //Returning the tokens
        return res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user_type: user.userType
        });

    }catch(err){
        console.log(`An error occoured during authentication: ${err}`);
        res.status(500).json({error: `An error occured during login`});
    }
})



/**
 * /auth/logout
 * 
 * @description This endpoint logs out the user
 * 
 * @method DELETE
 * 
 * @endpoint_url https://api.yourservice.com/auth/logout
 * 
 * 
 * 
 * @request
 *      @Request_Header 
 * 
 *      @Request_Body The request body is empty since the AccessToken is passed through cookies
 * 
 * 
 * 
 * @responses
 *      @SuccessResponse
 *          @example (204)
 *          @description The user has sucesfully logged out
 * 
 *      @ErrorResponse
 *          @example {json} (500)
 *              {
 *                  "error": "An error occoured during logout"
 *              }
 * 
 * 
 * 
 * @usage
 *      @example {curl} Example Usage:
 *          curl -X DELETE https://api.yourservice.com/auth/LOGOUT
 * 
 */
router.delete('/logout', authenticateToken, async (req, res) => {
    try{
        //delete the session from the database
        await Session.deleteMany( {user_id: req.user._id} );

        //delete the Tokens from the cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        console.log(`The user -${req.user.username}- has succesfully logged out!`);

        return res.sendStatus(204);

    }catch(err){
        console.log(`An error occoured during logout: ${err}`);
        return res.status(500).json({error: `An error occured during logout`});
    }
    
})



/**
 * /auth/posts
 * 
 * This endpoint will be updated when the user stories about asking for an object will be implemented. For now it is only a simple example
 * 
 * @description This endpoint authenticates a user and returns a content requested from the platfotm
 *  
 * @method GET
 * 
 * @endpoint_url https://api.yourservice.com/auth/post
 * 
 * 
 * 
 * @request
 *      @Request_Header 
 * 
 *      @Request_Body The request body is empty since the AccessToken is passed through cookies
 * 
 * 
 * 
 * @responses
 *      @SuccessResponse
 *          @example {json} (200)
 *          @description The data is returned from the db
 *              {
 *                  "data": "example_data"
 *              }
 * 
 *      @ErrorResponse
 *          @example {json} (500)
 *          @description An error occured during requesting data from the website
 *              {
 *                  "error": "An error occured during requesting services to the db"
 *              }
 * 
 * 
 * 
 * @usage
 *      @example {curl} Example Usage:
 *          curl -X GET https://api.yourservice.com/auth/posts
 * 
 */
router.get('/posts', authenticateToken, async (req, res) =>{
    try{
        //Search what the User wants
        const user = await User.findOne( {email: req.user.email} );
    
        console.log(`The user -${req.user.username}- has succesfully received data from the web-site!`);

        return res.status(200).json({data: user.username});

    }catch(err){
        console.log(`An error occoured during requesting data: ${err}`);
        return res.status(500).json({error: `An error occured during requesting services to the db`});
    }
    
})



/**
 * /auth/token
 * 
 * @description This endpoint generates a new AccessToken for the user
 * 
 * @method POST
 * 
 * @endpoint_url https://api.yourservice.com/auth/token
 * 
 * @request
 * 
 * @response
 *      @SuccessResponse
 *          @example {json} (200):
 *          @description The Token is sucessfully generated and given back in the response
 *              {
 *                  "AccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI7gH8Trdua..."
 *              }
 * 
 *      @ErrorResponse
 *          @example (403)
 *          @description You do not have the permission to access this part of the website (the Token is invalid)
 * 
 *          @example (401)
 *          @description The User does not have the AccessToken
 * 
 *          @example {json} (500):
 *          @description An error occured while crating a new token.
 *              {
 *                  "error": "An error occoured during requesting new token"
 *              }
 * 
 * 
 * 
 * @usage
 *      @example {curl} Example Usage:
 *          curl -X POST https://api.yourservice.com/auth/token
 * 
 */
router.post('/token', async (req, res)=>{
    try{
        //take the token from the cookies and check whether it exists
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken == null){
            return res.sendStatus(401);
        }
    
        //Find the session the refresh Token is associated with 
        const session = await Session.findOne({ refreshToken: { $in: [`${refreshToken}`] } });
        if (!session){
            return res.sendStatus(403);
        }
    
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
            if (err){
                return res.sendStatus(403);
            } 
    
            //create new accessToken and save it in the session on the DB and in the cookies
            const payload = {_id: user._id, username: user.username, email: user.email};
            const key_acc = process.env.ACCESS_TOKEN_SECRET;
            const key_ref = process.env.REFRESH_TOKEN_SECRET;
            const options = {expiresIn: '2000s'};
            const accessToken = jwt.sign(payload, key_acc, options);
    
            session.accessToken = accessToken;
            session.save();
    
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        
            console.log(`The user -${user.username}- has succesfully received a new token!`);

            return res.status(200).json({ accessToken: accessToken});
        })
    }catch(err){
        console.log(`An error occoured during requesting new token: ${err}`);
        return res.status(500).json({error: `An error occured while creating a new token.`});
    }
})



/**
 * @description This middleware autheticates the token.
 *
 * @param {object} req The request object contais the cookies and so the AccessToken.
 * @param {object} res The respons object contains the status that will be returned.
 * @param {function} next The next function contains the next middleware function to call  
*/
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
        console.log(`An error occoured during token authentication: ${err}`);
        return res.status(500).json({error: `An error occured during Token Authetication`});
    }
}

module.exports = router;