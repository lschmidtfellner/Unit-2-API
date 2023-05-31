import mongoose from 'mongoose'

let likeSchema = new mongoose.Schema( {
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  artist: {
    type: [String],
    required: [true, 'Artist is required']
  },
  previewURL: {
    type: String,
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
  }
})

let Like = mongoose.model("Like", likeSchema)

export default Like