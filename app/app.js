import express from 'express'
//import login from './authentication.js'
import registration from './register.js'
import upload from './upload.js'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import grid from 'gridfs-stream'

dotenv.config()
const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Streamshare API',
      description: "Documentation for Streamshare's REST API.",
      version: '1.0.0'
    }
  },
  apis: ['./app/*.js']
}
const swaggerDocs = swaggerJsdoc(swaggerOptions)

// connect to mongoDB databases

const accounts_connection = mongoose.createConnection(process.env.MONGO_ACCOUNTS_URI)
//.then(() => console.log('Connected to MongoDB accounts database'))
//.catch((err) => console.error('Could not connect to MongoDB accounts database ' + err));

const content_connection = mongoose.createConnection(process.env.MONGO_CONTENT_URI)
//.then(() => console.log('Connected to MongoDB content database'))
//.catch((err) => console.error('Could not connect to MongoDB content database ' + err));

const test_connection = mongoose.createConnection(process.env.MONGO_TEST_URI)
//.then(() => console.log('Connected to MongoDB test database'))
//.catch((err) => console.error('Could not connect to MongoDB test database' + err));

const connection = content_connection;

// create gridfs-stream instance
let gfs;
connection.once('open', () => {
  gfs = grid(connection.db, mongoose.mongo);
  gfs.collection('content')
})




app.use(express.json())
app.use(cors())
app.use('/auth', registration)
//app.use('/auth', login)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/content', upload);

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

export default {app, gfs, accounts_connection, content_connection, test_connection}
