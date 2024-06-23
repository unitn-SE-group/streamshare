const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { default: content_connection } = require('./connections/content');

/**
 * @openapi: 3.0.0
 * /auth/posts:
 *   get:
 *     summary: Retrieve content from the platform
 *     description: This endpoint authenticates a user and returns content requested from the platform. This is a placeholder example and will be updated when user stories about requesting objects are implemented.
 *     responses:
 *       '200':
 *         description: The data is returned from the database.
 *         content:
 *           application/json:
 *             example:
 *               data: "example_data"
 *       '500':
 *         description: An error occurred during requesting data from the website.
 *         content:
 *           application/json:
 *             example:
 *               error: "An error occurred during requesting services to the db."
 *     examples:
 *       curl:
 *         summary: Example Usage
 *         value: |
 *           curl -X GET https://api.yourservice.com/auth/posts
 */
router.get('/content', authenticateToken, async (req, res) => {
    try {
      //Retriving the Content from the database
      
      /*FIRST OPTION
        const catalog = await Content.find({});*/


      /*SECOND OPTION
      const files = await content_connection.files.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'No files found' });
        }

        // Extract filenames
        const filmNames = files.map(file => file.filename);
        res.json(filmNames);

      console.log(`The catalog is: ${catalog}`);*/

      console.log(`The user -${req.user.username}- has succesfully received the catalog from the web-site!`)
  
      return res.status(200).json({ catalog: catalog })
    } catch (err) {
      console.log(`An error occoured during requesting data: ${err}`)
      return res.status(500).json({ error: `An error occured during requesting services to the db` })
    }
  })