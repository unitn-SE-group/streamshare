import app from './app/app.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 8080

/**
 * Configure mongoose
 */
Promise = global.Promise
app.locals.db = mongoose.connect(process.env.MONGO_URI).then(() => {
  //console.log("Connected to Database");

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
})
