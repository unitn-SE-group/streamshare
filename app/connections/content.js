import dotenv from 'dotenv';
import { GridFsStorage } from 'multer-gridfs-storage'
dotenv.config();

// select db to connect to based on the environment
let storage;
if (process.env.NODE_ENV !== 'test') {
  // create storage engine
  storage = new GridFsStorage({
    url: process.env.MONGO_CONTENT_URI,
    file: (req, file) => {
        return {
            bucketName: 'upload', // the name of the bucket in gridfs
            filename: file.originalname
        }
    }
  })
  console.log("Connected to MongoDB content database!");

} else {
  // create storage engine
  storage = new GridFsStorage({
    url: process.env.MONGO_TEST_URI,
    file: (req, file) => {
        return {
            bucketName: 'upload', // the name of the bucket in gridfs
            filename: file.originalname
        }
    }
  })
  console.log("Connected to MongoDB content test database!");
}

export default storage;