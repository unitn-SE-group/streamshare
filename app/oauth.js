const http = require('http');
const https = require('https');
const url = require('url');
const { google } = require('googleapis');
const crypto = require('crypto');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const user = require('./models/user');
const router = express.Router();

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
 * To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const redirectUrl = 'http://127.0.0.1:3000/oauth/token'
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl
);

// Access scopes for read-only Drive activity.
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile openid',
  'https://www.googleapis.com/auth/user.birthday.read',
  'https://www.googleapis.com/auth/user.gender.read'
];
/* Global variable that stores user credential in this code example.
 * ACTION ITEM for developers:
 *   Store user's refresh token in your data store if
 *   incorporating this code into your real app.
 *   For more information on handling refresh tokens,
 *   see https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
 */
let userCredential = null;


const app = express();

router.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET, // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
}));

// Example on redirecting user to Google's OAuth 2.0 server.
router.get('/', async (req, res) => {
  // test headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');
  // Generate a secure random state value.
  //const state = crypto.randomBytes(32).toString('hex');
  //console.log('state', state)
  // Store state in the session
  //req.session.state = state;

  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Include the state parameter to reduce the risk of CSRF attacks.
    //state: state,
    prompt: 'consent'
  });

  //console.log('authorizationUrl', authorizationUrl);

  res.redirect(authorizationUrl);
});

// Receive the callback from Google's OAuth 2.0 server.
router.get('/token', async (req, res) => {
  
  // Handle the OAuth 2.0 server response
  let q = url.parse(req.url, true).query;

  let { tokens } = await oauth2Client.getToken(q.code);
  oauth2Client.setCredentials(tokens);

  /** Save credential to the global variable in case access token was refreshed.
    * ACTION ITEM: In a production app, you likely want to save the refresh token
    *              in a secure persistent database instead. */
  userCredential = tokens;

  

  // get and print user
  const user = oauth2Client.credentials;
  //console.log('user', user);
  const access_token = user.access_token;
  const refresh_token = user.refresh_token;
  const id_token = user.id_token;
  const user_data = await getUserData(access_token);

  // store new user in db
  const User = require('./models/user');
  const newUser = new User({
    createdWith: "google",
    userType: "consumer", // temporarily, until we implement the creator user type
    email: user_data.email,
    FirstName: user_data.name,
    username: user_data.name,
    birthday: user_data.birthday,
    gender: ((user_data.gender.toLowerCase() === 'male') ? true : false),
    friends: [],
  });
  newUser.save();

  // store new session in db
  const Session = require('./models/session');
  const newSession = new Session({
    user_id: newUser._id,
    refreshToken: refresh_token,
    accessToken: access_token,
  });
  newSession.save();


  // set cookies
  res.cookie('accessToken', access_token, { httpOnly: true, secure: true, sameSite: 'Strict' });
  res.cookie('refreshToken', refresh_token, { httpOnly: true, secure: true, sameSite: 'Strict' });
  // send response
  res.status(200).json({accessToken: access_token, refreshToken: refresh_token, userType: newUser.userType});
});

// Example on revoking a token
router.get('/revoke', async (req, res) => {
  // Build the string for the POST request
  let postData = "token=" + userCredential.access_token;

  // Options for POST request to Google's OAuth 2.0 server to revoke a token
  let postOptions = {
    host: 'oauth2.googleapis.com',
    port: '443',
    path: '/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  // Set up the request
  const postReq = https.request(postOptions, function (res) {
    res.setEncoding('utf8');
    res.on('data', d => {
      console.log('Response: ' + d);
    });
  });

  postReq.on('error', error => {
    console.log(error)
  });

  // Post the request with data
  postReq.write(postData);
  postReq.end();
});

async function getUserData(access_token) {
  //console.log('The access token is', access_token);
  
  const userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo';
  const people_url = `https://people.googleapis.com/v1/people/me?personFields=birthdays,genders`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  
  try {
    const userinfo_response = await fetch(userinfo_url, options);
    const people_response = await fetch(people_url, options);
    
    if (!userinfo_response.ok) {
      // If response is not ok, log the status and status text
      console.error('HTTP Error:', userinfo_response.status, userinfo_response.statusText);
      const errorData = await userinfo_response.json();
      console.error('Error Data:', errorData);
      return;
    }

    if (!people_response.ok) {
      // If response is not ok, log the status and status text
      console.error('HTTP Error:', people_response.status, people_response.statusText);
      const errorData = await people_response.json();
      console.error('Error Data:', errorData);
      return;
    }
    
    const userinfo_data = await userinfo_response.json();
    const people_data = await people_response.json();
    const response = {
      email: userinfo_data.email,
      name: userinfo_data.name,
      picture_url: userinfo_data.picture,
      gender: people_data.genders[0].value,
      birthday: new Date(
        Date.UTC(
        people_data.birthdays[0].date.year, 
        people_data.birthdays[0].date.month - 1, 
        people_data.birthdays[0].date.day
       )
      )
    };
    //console.log('Userinfo Data:', userinfo_data);
    //console.log('People Data:', people_data);
    //console.log('birthday', people_data.birthdays[0].date)
    //return Object.assign(userinfo_data, people_data);
    return response;
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

async function authenticateGoogleToken(req, res, next) {
  oauth2Client.verifyIdToken({
    idToken: req.body.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  }).then(ticket => {
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log('userid', userid);
    next();
  }).catch(console.error);
}

module.exports = router;