import mongoose from 'mongoose'

let songSchema = new mongoose.Schema( {
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  artist: {
    type: [String],
    required: [true, 'Artist is required']
  },
  genre: {
    type: [String],
    required: [true, 'Genre is required']
  },
  previewURL: {
    type: String,
    required: [true, 'Preview is required']
  },
  popularity: {
    type: Number,
    required: [true, 'Popularity is required']
  }
})

let Song = mongoose.model("Song", songSchema)

export default Song