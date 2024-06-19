/**
 * @file This file contains the registration API endpoint.
 * @module register
 */

import { Router } from 'express'
import User from './models/user.js'
import { config } from 'dotenv'

const router = Router()
config()

/**
 * Registers a new user.
 *
 * @name POST /register
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.userType - The type of user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.FirstName - The first name of the user.
 * @param {string} req.body.LastName - The last name of the user.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.gender - The gender of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.birthDay - The birth day of the user (dd/mm/yyyy).
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 * @throws {Error} If there is an error while registering the user.
 */
router.post('/register', async (req, res) => {
  try {
    const { userType, email, FirstName, LastName, username, gender, password, birthDay } = req.body

    // Checking if user already exists in the database
    const existingUser = await User.findOne({ email: email })
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
    res.status(201).json({ message: 'User created successfully', redirect_url: '/login' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
