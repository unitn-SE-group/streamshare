import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express'
import cookieParser from 'cookie-parser';
import {Session} from './connections/accounts.js'
import  content_connection from './connections/content.js';

dotenv.config()
const router = express.Router()

router.use(cookieParser())

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

/**
 * @openapi: 3.0.0
 * /content:
 *   get:
 *     summary: Retrieve the catalog of films and video
 *     description: This endpoint authenticates a user and returns the catalog present on the platform.
 *     responses:
 *       '200':
 *         description: The catalog is returned from the database.
 *         content:
 *           application/json:
 *             example:
 *               catalog: ["example_video_1.mp4" , "example_video_2.mp4"]
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
router.get('', authenticateToken, async (req, res) => {
  //Retriving the Content from the database
    try {

      const filesCollection = content_connection.collection(`upload.files`);

      const files = await filesCollection.find().toArray();

      if (!files || files.length === 0) {
          return res.status(404).json({ message: 'No files found' });
      }

      // Extract filenames
      const filmNames = files.map(file => file.filename);

      console.log(`The catalog is: ${filmNames}`);

      console.log(`The user -${req.user.username}- has succesfully received the catalog from the web-site!`)
  
      return res.status(200).json({ catalog: filmNames })
    } catch (err) {
      console.log(`An error occoured during requesting data: ${err}`)
      return res.status(500).json({ error: `An error occured during requesting services to the db` })
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