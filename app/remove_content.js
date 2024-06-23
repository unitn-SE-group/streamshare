import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage';

dotenv.config();
const router = express.Router();

router.use(cookieParser());

const storage = new GridFsStorage({
  url: process.env.MONGO_CONTENT_URI,
  file: (req, file) => {
    return {
      bucketName: 'upload',
      filename: file.originalname,
    };
  },
});

const upload = multer({ storage });

mongoose.connect(process.env.MONGO_CONTENT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'upload',
  });
});

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.sendStatus(401);
    }

    const session = await Session.findOne({ accessToken: token }).populate('user_id');
    const userType = session.user_id.userType;

    if (userType === 'google') {
      oauth2Client.verifyIdToken({
        idToken: req.body.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      }).then(ticket => {
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('userid', userid);
        next();
      }).catch(err => {
        console.error(err);
        return res.sendStatus(403);
      });
    } else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    }
  } catch (err) {
    console.log(`An error occurred during token authentication: ${err}`);
    return res.status(500).json({ error: 'An error occurred during Token Authentication' });
  }
};

router.delete('/content/:contentId', authenticateToken, (req, res) => {
  const { contentId } = req.params;

  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized: Admins only' });
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    gfs.delete(new mongoose.Types.ObjectId(contentId), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting file', details: err.message });
      }

      res.status(200).json({ message: 'File deleted successfully' });
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }
});

export default router;

