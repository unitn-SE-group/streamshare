import express, { json } from 'express'
const app = express()
import registration from './register.js'

app.use(json())
app.use('/register', registration)
export default app
