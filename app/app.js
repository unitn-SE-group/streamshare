import express from 'express'
import { router as login } from './authentication.js'
import registration from './register.js'
import upload from './upload.js'
import deleteFileRouter from './remove_content.js'
import oauth from './oauth.js'
import content from './view-content.js'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import test from './test.js'

dotenv.config()
const app = express()
app.use(cookieParser())

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
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
app.use(express.urlencoded({ extended: true }))
app.use('/auth', registration)
app.use('/auth', login)
app.use('/oauth', oauth)
app.use('/content', content)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/content', upload)
app.use('/content', deleteFileRouter)

// include test enpoint if necessary
if (process.env.NODE_ENV === 'test') {
  app.use('/', test)
}

export default app
