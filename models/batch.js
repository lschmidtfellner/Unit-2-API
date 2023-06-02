import mongoose from 'mongoose'

const BatchSchema = new mongoose.Schema({
  name: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
  ]
})

const Batch = mongoose.model('Batch', BatchSchema)
export default Batch
