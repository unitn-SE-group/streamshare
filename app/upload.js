import { Router } from 'express'
import multer from 'multer'
import dotenv from 'dotenv'
import { GridFsStorage } from 'multer-gridfs-storage'

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

router.post('/', upload.single('file'), async (req, res) => {
    // TODO check user permission

    if(!req.file) {
        return send.status(400).send('No file uploaded.');
    }
    res.status(201).send({
        file: req.file
    });
})
export default router;
