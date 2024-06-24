import request from 'supertest';
import app from '../app/upload.js';
import path from 'path';

describe('POST /content', () => {
    /**
     * Send a POST request to the API upload endpoint with an object containing the video file
     */
    it('should respond with a 201 status code and confirmation of video upload', async () => {
        // Defining the path to the test video file
        const videoPath = path.join(__dirname, 'test-videos', 'video.mp4'); // Make sure to place the video file in the specified folder
        
        const videoData = {
            file : videoPath,
        };

        // Send the POST request with the video file attached
        const res = await request(app)
            .post('/content').send(videoData)

        expect(res.status).toBe(201);
    });
});
