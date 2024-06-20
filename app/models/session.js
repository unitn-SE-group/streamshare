import mongoose from 'mongoose';

//Create a Session schema
const sessionSchema = new mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        refreshToken: {
            type: [String],
            required: true,
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

export default mongoose.model("Session", sessionSchema);
