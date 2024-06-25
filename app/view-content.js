import express from 'express'
import { storage, connection } from './connections/content.js'
import { authenticateToken } from './authentication.js'
import mongoose from 'mongoose'

const router = express.Router()

mongoose.connect(process.env.MONGO_CONTENT_URI)
const conn = mongoose.connection

/**
 * @openapi: 3.0.0
 * /content:
 *   get:
 *     summary: Retrieve the catalog of films and video
 *     description: This endpoint authenticates a user and returns the catalog present on the platform.
 *     tags:
 *      - Content
 *     responses:
 *       '200':
 *         description: The catalog is returned from the database.
 *         content:
 *           application/json:
 *             example:
 *               catalog: [
 *                          {
 *                            "id": "66785590df892d92e1e1c9d7",
 *                            "filename": "example_1.mp4"
 *                          },
 *                          {
 *                            "id": "667a8d035b590f148012b757",
 *                            "filename": "example_2.mp4"
 *                          },
 *                        ]
 *       '404':
 *         description: There is no file in the database
 *         content:
 *           application/json:
 *             example:
 *               error: "No files found"
 *       '500':
 *         description: An error occurred during requesting data from the website.
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred during requesting data to the db."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X GET https://api.yourservice.com/content
 */
router.get('/', authenticateToken('anyone'), async (req, res) => {
  //Retriving the Content from the database
  try {
    const files = await filesCollection.find().toArray()
    const filesCollection = conn.collection('upload.files')

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found' })
    }

    // Extract filenames
    // Extract filenames and IDs
    const catalog = files.map((file) => ({
      id: file._id.toString(), // Convert ObjectId to string
      filename: file.filename
    }))
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173/admin-dashboard')
    return res.status(200).json({ catalog: catalog })
  } catch (err) {
    console.log(`An error occoured during requesting data: ${err}`)
    return res.status(500).json({ error: `An error occured during requesting services to the db` })
  }
})

export default router
