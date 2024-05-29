import express from 'express'
import registration from './register.js'
import { connect } from 'mongoose'
import cors from 'cors'

const app = express()

connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err))

app.use(express.json())
app.use(cors())
app.use('/api', registration)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

export default app
