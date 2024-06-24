import { authenticateToken } from './authentication.js'
import {storage} from './connections/content.js'
import { Router } from 'express'
import multer from 'multer'
import dotenv from 'dotenv'


dotenv.config();
const router = Router();

const upload  = multer({storage})

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file to the server. Requires token authentication.
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             file:
 *               contentType: application/octet-stream
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: object
 *                   description: Details of the uploaded file
 *       400:
 *         description: No file uploaded
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       403:
 *         description: Forbidden, token invalid
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *     security:
 *       - cookieAuth: []
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *   schemas:
 *     File:
 *       type: object
 *       properties:
 *         fieldname:
 *           type: string
 *         originalname:
 *           type: string
 *         encoding:
 *           type: string
 *         mimetype:
 *           type: string
 *         size:
 *           type: integer
 *         destination:
 *           type: string
 *         filename:
 *           type: string
 *         path:
 *           type: string
 */
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