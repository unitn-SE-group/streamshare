import ObjectId from 'mongodb';
import mongoose from 'mongoose';


//Create a User schema
const sessionSchema = new mongoose.Schema({
        user_id: {
            type: ObjectId,
            require: true,
        },

        refreshToken: {
            type: [String],
            require: true,
        },
        
        accessToken: {
            type: String,
            required: true,
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
