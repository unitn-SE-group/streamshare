import mongoose from 'mongoose';
import { Router } from 'express';
import { GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { authenticateToken } from './authentication.js';

dotenv.config();
const router = Router();

/**
 * @openapi
 * /content/:contentId:
 *  delete:
 *    summary: delete a content from the database
 *    description: Recieves the mongoDB id and removes the content with the corrisponding id in the database (if present)
 *    requestBody:
 *      required: true
 *      content:
 *        properties:
 *          params:
 *            type: string
 *            description: the id of the content the requester wants to remove
 *    responses:
 *      204:
 *        description: Content deleted successfully.
 *      400:
 *        description: Invalid ID format.
 *      500:
 *        description: Error deleting file.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: An error message.
 *            
 * 
 */



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
  const { contentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    return res.status(400).json({ error: 'Invalid ID format.' });
  }

  try {
    // Delete file from GridFS using the file's ObjectId
    await gfs.delete(new mongoose.Types.ObjectId(contentId));
    res.status(204).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Error deleting file.', details: error.message });
  }
});

export default router;
