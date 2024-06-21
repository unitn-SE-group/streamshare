import express from 'express'
import login from './authentication.js'
import registration from './register.js'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { connect } from 'mongoose'

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

// use different uri based on the environment
connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err))

app.use(express.json())
app.use(cors())
app.use('/auth', registration)
app.use('/auth', login)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default app
