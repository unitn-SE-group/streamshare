/**
 * @file This file contains the registration API endpoint.
 * @module register
 */

import { Router } from 'express'
import { User } from './connections/accounts.js'
import { config } from 'dotenv'

const router = Router()
config()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     description: Receives user registration data and creates a new user in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               createdWith:
 *                 type: string
 *                 description: Where the user is registered from (local, google)
 *               userType:
 *                 type: string
 *                 description: The type of user (e.g., consumer).
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               FirstName:
 *                 type: string
 *                 description: The first name of the user.
 *               LastName:
 *                 type: string
 *                 description: The last name of the user.
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               gender:
 *                 type: string
 *                 description: The gender of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               birthDay:
 *                 type: string
 *                 description: The birth day of the user.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 redirect_url:
 *                   type: string
 *                   description: URL to redirect the user after successful registration.
 *       409:
 *         description: User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 */

router.post('/register', async (req, res) => {
  try {
    const { userType, email, FirstName, LastName, username, gender, password, birthDay } = req.body

    // Check if all required fields are provided
    const requiredFields = [
      'userType',
      'email',
      'FirstName',
      'LastName',
      'username',
      'gender',
      'password',
      'birthDay'
    ]
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` })
      }
    }

    // Checking if user already exists in the database
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const newUser = new User({
      createdWith: 'local',
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
    return res.status(201).json({ message: 'User created successfully', redirect_url: '/login' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

export default router
