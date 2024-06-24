import express from 'express'
import content_connection from './connections/content.js';
import authenticateToken from './authentication.js';

const router = express.Router()

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
  
      return res.status(200).json({ catalog: filmNames })
    } catch (err) {
      console.log(`An error occoured during requesting data: ${err}`)
      return res.status(500).json({ error: `An error occured during requesting services to the db` })
    }
  })

export default router