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
  popularity: {
    type: Number,
    required: [true, 'Popularity is required'],
    min: [1, 'Too small'],
    max: [100, 'Too large']
  },
  spotify_id: {
    type: String,
    required: [true, 'Spotify ID is required']
  },
  previewURL: {
    type: String,
  },
})

let Song = mongoose.model("Song", songSchema)

export default Song