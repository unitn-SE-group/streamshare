import mongoose from 'mongoose';
import { Router } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import multer from 'multer';
import dotenv from 'dotenv';
import { authenticateToken } from './authentication.js';

dotenv.config();
const router = Router();

// Establish MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_CONTENT_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;

// Create GridFSBucket instance
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'upload', // Name of your bucket in GridFS
  });
});

router.delete('/content/:contentId', [authenticateToken('admin', 'creator')], async (req, res) => {
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
    // Delete file from GridFS using the file's ObjectId
    await gfs.delete(new ObjectId(contentId));
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Error deleting file', details: error.message });
  }
});

export default router;
