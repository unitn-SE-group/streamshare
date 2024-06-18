import express from 'express'
import login from './authentication.js'
import registration from './register.js'
import { connect } from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err))

app.use(express.json())
app.use(cors())
app.use('/auth', registration)
app.use('/auth', login)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

export default app
