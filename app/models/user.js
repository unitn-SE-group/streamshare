const mongoose = require("mongoose")

//Create a User schema
const userSchema = new mongoose.Schema({
    userType: ['admin', 'creator', 'consumer'],

    email: {
        type: String, 
        required: true,
        lowercase: true,
    },

    FirstName: {
        type: String, 
        required: true,
    },

    LastName: {
        type: String, 
        required: true,
    },

    username: {
        type: String, 
        required: true,
    },

    /*0->Femmina, 1->Maschio */
    gender: {
        type: Boolean,
        required: true,
    },

    password: {
        type: String, 
        required: true,
    },

    /*Still don't know hot to do this*/
    friends: [{ type : ObjectId, ref: 'User' }],

    birthDay: {
        type: Date,
        required: true  
    },

    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },

    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model("User", userSchema)