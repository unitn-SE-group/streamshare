import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { File } from './models/content.js';

dotenv.config()
const router = express.Router()

router.use(cookieParser());

router.delete('/remove_content/:id', authenticateToken, async (req, res) => {
    const { id } = req.body;

    if (req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized: Admins only' });
    }

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error : 'Invalid ID format'});
    }

    try {
        const file = await File.findByIdAndDelete(id);

        if(!file) {
            return res.status(400).json({error : 'File not found'});
        }

        res.status(200).json({message : 'File deleted successfully'});
    } catch (error) {
        res.status(500).json({error : 'An error occured while deleting the file', details: error.message});
    }

});


async function authenticateToken(req, res, next) {
    try{
        //take the access Token from the cookies if exists
        const token = req.cookies.accessToken;

        if (!token) {
            return res.sendStatus(401);
        }

        // retrieve user type from db
        const session = await Session.findOne({accessToken: token}).populate('user_id');
        const userType = session.user_id.userType;

        // authenticate based on user type
        if (userType === 'google') {
            oauth2Client.verifyIdToken({
                idToken: req.body.id_token,
                audience: process.env.GOOGLE_CLIENT_ID
              }).then(ticket => {
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                console.log('userid', userid);
                next();
              }).catch(console.error);
              next();
        }
        else {    
            //check whether the token is correct
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        }

    }catch(err){
        console.log(`An error occoured during token authentication: ${err}`);
        return res.status(500).json({error: `An error occured during Token Authetication`});
    }
}

export default router;
