import { Router } from 'express';
import { authenticateToken } from './authentication.js';
import cookieParser from 'cookie-parser';

const router = Router();


/**
 * endpoint accessible only by admin
 */
router.get('/test1', authenticateToken('admin') ,async (req, res) => {
    res.status(200).send('ok');
});

/**
 * endpoint accessible by anyone
 */
router.get('/test2', authenticateToken('anyone') ,async (req, res) => {
    res.status(200).send('ok');
});

export default router;