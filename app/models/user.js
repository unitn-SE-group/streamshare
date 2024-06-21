import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//Create the user schema
const userSchema = new mongoose.Schema({
    createdWith: {
        type: String,
        enum: ['google','local'],
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
    lowercase: true
  },

  FirstName: {
    type: String,
    required: true
  },

  LastName: {
      type: String, 
  },

  username: {
    type: String,
    required: true
  },

  /*0->Femmina, 1->Maschio */
  gender: {
    type: Boolean,
    required: true
  },


  password: {
      type: String, 
  },
  
  friends: [mongoose.SchemaTypes.ObjectId],

  birthDay: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },

  updatedAt: {
    type: Date,
    default: () => Date.now()
  }
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

export default mongoose.model("User", userSchema);

