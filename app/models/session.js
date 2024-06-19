const mongoose = require("mongoose")
const User = require("./user");

//Create a User schema
const sessionSchema = new mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },

        refreshToken: {
            type: String,
            require: true,
        },
        
        accessToken: {
            type: String,
        },
        
        updatedAt: {
            type: Date,
            required: true,
            default: () => Date.now(),
        },
        
        createdAt: {
            type: Date,
            required: true,
            default: () => Date.now(),
        }
})

module.exports = mongoose.model("Session", sessionSchema)
