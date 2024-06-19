// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require("./models/User");
// const dotenv = require('dotenv');

// const express = require('express');
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from './models/user.js'

const router = express.Router()

dotenv.config()

/**Add /login endpoint */
router.post(`/login`, async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(`The email is: ${email}`)
  console.log(`The password is: ${password}`)

  if (!email || !password) {
    return res.status(400).json({ error: `Invalid name or password` }) //Bad Request
  }

  try {
    //search for the email in the database
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ error: `Account not registered` }) //Not Found
    } else {
      console.log(`FOUND IT ->  ${user.username}`)
    }

    //control if the password is correct
    const password_match = await bcrypt.compare(password, user.password)
    if (!password_match) {
      return res.status(401).json({ error: `Invalid password` }) //Unauthorizied
    }

    //generate JWT token
    const payload = { username: user.username, email: user.email }
    const key_acc = process.env.ACCESS_TOKEN_SECRET
    const key_ref = process.env.REFRESH_TOKEN_SECRET
    const options = { expiresIn: '30m' }
    const accessToken = jwt.sign(payload, key_acc, options)
    const refreshToken = jwt.sign(payload, key_ref)

    //Update the session schema in the database

    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken
    })
  } catch (err) {
    console.log(`An error occoured during authentication: ${err}`)
    res.status(500)
  }
})

export default router
