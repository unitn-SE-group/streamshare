const mongoose = require("mongoose")

//Create a User schema
const sessionSchema = new mongoose.Schema({
        user_id: {
            type: User,
            require: true,
        },

        refreshToken: {
            type: String,
            require: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
        updatedAt: {
            type: date,
            required: yes,
        },
        createdAt: {
            type: date,
            required: yes,
        }
})

module.exports = mongoose.model("Session", sessionSchema)