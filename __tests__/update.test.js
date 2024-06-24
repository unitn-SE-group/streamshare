import request from 'supertest';
import app from '../app/app';

describe('POST /content',() => {
    /**
     * Send a POST request to the API upload endpoint with an object containing the video file
     */
    it.skip('should respond with a 201 status code and confirmation of video upload', async () => {
        // Defining the path to the test video file
        const videoPath = './assets/test_video.mp4';

        // Send the POST request with the video file attached
        console.log('Sending POST request with video file attached...');
        const res = await request(app)
            .post('/content')
            .attach('file', videoPath);

        console.log('Response:', res.body);

        expect(res.status).toBe(201);
    });
});
