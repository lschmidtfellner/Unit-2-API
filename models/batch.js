import mongoose from 'mongoose'

const BatchSchema = new mongoose.Schema({
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    }
  ]
})

const Batch = mongoose.model('Batch', BatchSchema)
export default Batch
