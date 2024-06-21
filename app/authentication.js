import { google } from 'googleapis'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {User, Session} from './connections/accounts.js'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'

dotenv.config()
const router = express.Router()

router.use(cookieParser())

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

/**
 * @openapi: 3.0.0
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return tokens
 *     description: This endpoint authenticates a user and returns an Access Token that can be used for subsequent API requests and a Refresh Token.
 *     requestBody:
 *       description: The request body should be a JSON object containing the user's credentials which are email and password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: yourpassword
 *     responses:
 *       '200':
 *         description: The user has provided the correct email and password and is given tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 RefreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 AccessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI7gH8Trdua..."
 *                 UserType:
 *                   type: string
 *                   enum:
 *                     - admin
 *                     - creator
 *                     - user
 *       '400':
 *         description: The user has inserted an invalid request, both email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request. Email and password are required."
 *       '401':
 *         description: The user has inserted an invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid password."
 *       '404':
 *         description: The user has inserted an invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Account not registered."
 *       '500':
 *         description: The server has had some problems during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during login."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X POST https://api.yourservice.com/auth/login \
 *                -H "Content-Type: application/json" \
 *                -d '{"email": "user@example.com", "password": "yourpassword"}'
 */
router.post(`/login`, async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    return res.status(400).json({ error: `Invalid request. Username and password are required.` }) //Bad Request
  }

  try {
    //Search for the account in the database
    console.log(User);
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({ error: `Account not registered` }) //Not Found
    }

    //Check is the password is correct
    const password_match = await bcrypt.compare(password, user.password)

    if (!password_match) {
      return res.status(401).json({ error: `Invalid password` }) //Unauthorizied
    }

    //Generate JWT token
    const payload = { _id: user._id, username: user.username, email: user.email }
    const key_acc = process.env.ACCESS_TOKEN_SECRET
    const key_ref = process.env.REFRESH_TOKEN_SECRET
    const options = { expiresIn: '2000s' }
    const accessToken = jwt.sign(payload, key_acc, options)
    const refreshToken = jwt.sign(payload, key_ref)

    //Update and save the session schema in the database
    const newSession = new Session({
      user_id: user._id,
      refreshToken: refreshToken,
      accessToken: accessToken
    })
    await newSession.save()

    //Setting the Tokens in the cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' })

    console.log(`The user -${user.username}- is succesfully logged in!`)

    //Returning the tokens
    return res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user_type: user.userType
    })
  } catch (err) {
    console.log(`An error occoured during authentication: ${err}`)
    res.status(500).json({ error: `An error occured during login ${err}` })
  }
})

/**
 * @openapi: 3.0.0
 * /auth/logout:
 *   delete:
 *     summary: Logs out the user
 *     description: This endpoint logs out the user.
 *     responses:
 *       '204':
 *         description: The user has successfully logged out.
 *       '500':
 *         description: An error occurred during logout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during logout."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X DELETE https://api.yourservice.com/auth/logout
 */
router.delete('/logout', authenticateToken, async (req, res) => {
  try {
    //delete the session from the database
    await Session.deleteMany({ user_id: req.user._id })

    //delete the Tokens from the cookies
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    console.log(`The user -${req.user.username}- has succesfully logged out!`)

    return res.sendStatus(204)
  } catch (err) {
    console.log(`An error occoured during logout: ${err}`)
    return res.status(500).json({ error: `An error occured during logout` })
  }
})

/**
 * @openapi: 3.0.0
 * /auth/posts:
 *   get:
 *     summary: Retrieve content from the platform
 *     description: This endpoint authenticates a user and returns content requested from the platform. This is a placeholder example and will be updated when user stories about requesting objects are implemented.
 *     responses:
 *       '200':
 *         description: The data is returned from the database.
 *         content:
 *           application/json:
 *             example:
 *               data: "example_data"
 *       '500':
 *         description: An error occurred during requesting data from the website.
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred during requesting services to the db."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X GET https://api.yourservice.com/auth/posts
 */
router.get('/posts', authenticateToken, async (req, res) => {
  try {
    //Search what the User wants
    const user = await User.findOne({ email: req.user.email })

    console.log(`The user -${req.user.username}- has succesfully received data from the web-site!`)

    return res.status(200).json({ data: user.username })
  } catch (err) {
    console.log(`An error occoured during requesting data: ${err}`)
    return res.status(500).json({ error: `An error occured during requesting services to the db` })
  }
})

/**
 * @openapi: 3.0.0
 * /auth/token:
 *   post:
 *     summary: Generate a new Access Token
 *     description: This endpoint generates a new AccessToken for the user.
 *     responses:
 *       '200':
 *         description: The token is successfully generated and returned in the response.
 *         content:
 *           application/json:
 *             example:
 *               AccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI7gH8Trdua..."
 *       '403':
 *         description: You do not have permission to access this part of the website (the token is invalid).
 *       '401':
 *         description: The user does not have the AccessToken.
 *       '500':
 *         description: An error occurred while creating a new token.
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred during requesting new token."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X POST https://api.yourservice.com/auth/token
 */
router.post('/token', async (req, res) => {
  try {
    //take the token from the cookies and check whether it exists
    const refreshToken = req.cookies.refreshToken
    if (refreshToken == null) {
      return res.sendStatus(401)
    }

    //Find the session the refresh Token is associated with
    const session = await Session.findOne({ refreshToken: { $in: [`${refreshToken}`] } })
    if (!session) {
      return res.sendStatus(403)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }

      //create new accessToken and save it in the session on the DB and in the cookies
      const payload = { _id: user._id, username: user.username, email: user.email }
      const key_acc = process.env.ACCESS_TOKEN_SECRET
      const key_ref = process.env.REFRESH_TOKEN_SECRET
      const options = { expiresIn: '2000s' }
      const accessToken = jwt.sign(payload, key_acc, options)

      session.accessToken = accessToken
      session.save()

      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' })

      console.log(`The user -${user.username}- has succesfully received a new token!`)

      return res.status(200).json({ accessToken: accessToken })
    })
  } catch (err) {
    console.log(`An error occoured during requesting new token: ${err}`)
    return res.status(500).json({ error: `An error occured while creating a new token.` })
  }
})

async function authenticateToken(req, res, next) {
  try {
    //take the access Token from the cookies if exists
    const token = req.cookies.accessToken

    if (!token) {
      return res.sendStatus(401)
    }

    // retrieve user type from db
    const session = await Session.findOne({ accessToken: token }).populate('user_id')
    const userType = session.user_id.userType

    // authenticate based on user type
    if (userType === 'google') {
      oauth2Client
        .verifyIdToken({
          idToken: req.body.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((ticket) => {
          const payload = ticket.getPayload()
          const userid = payload['sub']
          console.log('userid', userid)
          next()
        })
        .catch(console.error)
      next()
    } else {
      //check whether the token is correct
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403)
        }
        req.user = user
        next()
      })
    }
  } catch (err) {
    console.log(`An error occoured during token authentication: ${err}`)
    return res.status(500).json({ error: `An error occured during Token Authetication` })
  }
}

export default router
