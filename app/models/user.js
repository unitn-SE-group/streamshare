const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//Create a User schema
const userSchema = new mongoose.Schema({
    googleAccount: {
        type: Boolean,
        required: true,
    },

    userType: {
        type: String,
        enum: ['admin', 'creator', 'consumer'],
        required: true
    },

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

    friends: [mongoose.SchemaTypes.ObjectId],

    birthDay: {
        type: Date,
        required: true, 
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

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model("User", userSchema)
