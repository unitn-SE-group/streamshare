import { Router } from 'express'
import User, { findOne } from './models/user.js'
import { config } from 'dotenv'

const router = Router()
config()

// connecting to database (not necessary since unified)
// mongoose
//   .connect(process.env.DATABASE_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Could not connect to MongoDB ' + err))

router.post('/register', async (req, res) => {
  try {
    const { userType, email, FirstName, LastName, username, gender, password, birthDay } = req.body

    // Checking if user already exists in the database
    const existingUser = await findOne({ email: email })
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const newUser = new User({
      userType,
      email,
      FirstName,
      LastName,
      username,
      gender,
      password,
      birthDay
    })

    await newUser.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
