import express from 'express'
import {router as login} from './authentication.js'
import registration from './register.js'
import upload from './upload.js'
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

app.use(express.json())
app.use(cors())
app.use('/auth', registration)
app.use('/auth', login)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/content', upload);

export default app
