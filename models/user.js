import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    }
  ]
})

const User = mongoose.model('User', UserSchema)

export default User
