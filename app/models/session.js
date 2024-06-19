import ObjectId from 'mongodb';
import mongoose from 'mongoose';


//Create a User schema
const sessionSchema = new mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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

export default mongoose.model("Session", sessionSchema)
