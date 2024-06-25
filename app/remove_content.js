import mongoose from 'mongoose';
import { Router } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { authenticateToken } from './authentication.js';

dotenv.config();
const router = Router();

// Establish MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_CONTENT_URI);
const conn = mongoose.connection;

// Create GridFSBucket instance
let gfs;
conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'upload', // Name of your bucket in GridFS
  });
});

router.delete('/:contentId', [authenticateToken('admin', 'creator')], async (req, res) => {
  console.log('Received DELETE request');
  const { contentId } = req.params;
  console.log('Content ID:', contentId);

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // Delete file from GridFS using the file's ObjectId
    await gfs.delete(new mongoose.Types.ObjectId(contentId));
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Error deleting file', details: error.message });
  }
});

export default router;
