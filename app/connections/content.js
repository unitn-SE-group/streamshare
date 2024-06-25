import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { GridFsStorage } from 'multer-gridfs-storage'
dotenv.config()

// select db to connect to based on the environment
let connection
let storage
if (process.env.NODE_ENV !== 'test') {
  // connect to the content database
  connection = mongoose.connect(process.env.MONGO_CONTENT_URI)
  // create storage engine
  storage = new GridFsStorage({
    db: connection,
    file: (req, file) => {
      return {
        bucketName: 'upload', // the name of the bucket in gridfs
        filename: file.originalname
      }
    }
  })
  console.log('Connected to MongoDB content database!')
} else {
  // connect to the test database
  connection = mongoose.connect(process.env.MONGO_TEST_URI)
  // create storage engine
  storage = new GridFsStorage({
    db: connection,
    file: (req, file) => {
      return {
        bucketName: 'upload', // the name of the bucket in gridfs
        filename: file.originalname
      }
    }
  })
  console.log('Connected to MongoDB content test database!')
}

export { storage, connection }
