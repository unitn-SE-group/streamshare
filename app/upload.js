import { Router } from 'express'
import multer from 'multer'
import dotenv from 'dotenv'
import { GridFsStorage } from 'multer-gridfs-storage'
import { authenticateToken } from './authentication.js'

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

const upload  = multer({storage})


/**
 * @openapi
 * /content:
 *   post:
 *     summary: Upload a video.
 *     description: Receives a video file and uploads it to the database.
 *     tags:
 *      - Content
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *              file:
 *                  type: string
 *                  format: binary
 *                  description: The video file to upload
 *
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     encoding:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *                     id:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     metadata:
 *                       type: object
 *                     bucketName:
 *                       type: string  
 *                     chunkSize:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     uploadDate:
 *                       type: string
 *                     contentType:
 *                       type: string
 *       '400':
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'No file uploaded.'
 *       '401':
 *         description: Unauthorized. Access token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Unauthorized'
 *       '403':
 *         description: Forbidden. User does not have the necessary permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Forbidden'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: 'Internal Server Error'
 * */
router.post('/', [ authenticateToken('admin','creator'), upload.single('file') ], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.status(201).send({
            file: req.file,
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
export default router;
