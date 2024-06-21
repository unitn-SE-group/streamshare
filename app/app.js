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

// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err));
const connection = mongoose.connection;

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

export default {app, gfs}
