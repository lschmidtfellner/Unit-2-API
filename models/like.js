import mongoose from 'mongoose'

let likeSchema = new mongoose.Schema({
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
    required: [true, 'Popularity is required']
  },
  spotify_id: {
    type: String,
    required: [true, 'Spotify ID is required']
  },
  previewURL: {
    type: String
  },
  artURL: {
    type: String
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

let Like = mongoose.model('Like', likeSchema)

export default Like
