import express, { json } from 'express'
import registration from './register.js'
import mongoose from 'mongoose'

const app = express()

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB ' + err))

app.use(json())
app.use('/register', registration)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

export default app
