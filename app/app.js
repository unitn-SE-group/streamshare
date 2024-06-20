import express from 'express'
// import login from './authentication.js'
import registration from './register.js'
import oauth from './oauth.js'
import { connect } from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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

connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err))

app.use(express.json())
app.use(cors())
app.use('/auth', registration)
// app.use('/auth', login)
app.use('/oauth', oauth)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

export default app
