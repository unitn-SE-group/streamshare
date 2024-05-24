const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//Create a User schema
const userSchema = new mongoose.Schema({
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

// Method to compare passwords
userSchema.methods.comparePassword = function(pw_from_db) {
    return bcrypt.compare(pw_from_db, this.password);
};

module.exports = mongoose.model("User", userSchema)
