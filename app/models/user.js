import { Schema, SchemaTypes, model } from 'mongoose'
import { hash } from 'bcrypt'

//Create a User schema
const userSchema = new Schema({
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
    required: true
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
    required: true
  },

  friends: [SchemaTypes.ObjectId],

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
    this.password = await hash(this.password, 10)
  }
  next()
})

export default model('User', userSchema)
