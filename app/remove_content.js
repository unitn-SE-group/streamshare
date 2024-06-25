import mongoose from 'mongoose';
import { Router } from 'express'
import multer from 'multer'
import dotenv from 'dotenv'
import { GridFsStorage } from 'multer-gridfs-storage'
import authenticateToken  from './authentication.js'

dotenv.config();
const router = Router();

// create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_CONTENT_URI,
    file: (req, file) => {
        return {
            bucketName: 'upload', // the name of the bucket in gridfs
            filename: file.originalname
        }
    }
})

router.delete('/content/:contentId', [authenticateToken('admin','creator')], (req, res) => {
  console.log('Received DELETE request');
  const { contentId } = req.params;
  console.log('Content ID:', contentId);

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

