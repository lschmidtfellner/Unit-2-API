//import dependencies

import mongoose from 'mongoose'
import mongodb from 'mongodb'
import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'
import { db } from './db/connection.js'

import { getAccessToken } from './db/connection.js'

//config
dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(express.json())

//models
import Song from './models/song.js'
import Batch from './models/batch.js'
import Like from './models/like.js'
import User from './models/user.js'

//GET individual song information from spotify based on ID
app.get('/song/:id', async (req, res) => {
  try {
    const { id } = req.params
    const songURL = `https://api.spotify.com/v1/tracks/${id}`

    // Get access token
    const accessToken = await getAccessToken()

    const response = await axios.get(songURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    // Handle the response data here
    const songData = response.data

    res.json(songData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//GET single song document based on search
app.get('/search', async (req, res) => {
  const { artist, song } = req.query
  const query = `track:${song} artist:${artist}`
  const accessToken = await getAccessToken()

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      params: {
        q: query,
        type: 'track',
        limit: 1
      }
    })

    const tracks = response.data.tracks.items
    if (tracks.length > 0) {
      res.json(tracks[0])
    } else {
      res.status(404).send('No songs found.')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong.')
  }
})

//GET recommendations array based on individual song info
app.get(':userId/recommendations', async (req, res) => {
  const accessToken = await getAccessToken()
  let { seed_artists, seed_tracks, seed_genres, max_popularity } = req.query

  // Convert to arrays in case single values are provided
  if (seed_artists) seed_artists = seed_artists.split(',')
  if (seed_tracks) seed_tracks = seed_tracks.split(',')
  if (seed_genres) seed_genres = seed_genres.split(',')

  if (!seed_artists && !seed_tracks && !seed_genres) {
    res
      .status(400)
      .send(
        'You must provide at least one of seed_artists, seed_tracks, or seed_genres.'
      )
    return
  }

  const params = { limit: 10 }
  if (seed_artists) params.seed_artists = seed_artists.join(',')
  if (seed_tracks) params.seed_tracks = seed_tracks.join(',')
  if (seed_genres) params.seed_genres = seed_genres.join(',')
  if (max_popularity) params.max_popularity = max_popularity

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        params
      }
    )

    // Transform data before sending response
    const transformedData = response.data.tracks.map((track) => ({
      artist: track.artists.map((artist) => artist.name).join(', '),
      popularity: track.popularity,
      spotify_id: track.id,
      title: track.name, // assuming 'title' is equivalent to the song name
      previewURL: track.preview_url // use the track's preview_url field
    }))

    // Save to MongoDB
    const songIds = []
    for (let songData of transformedData) {
      const song = new Song(songData)
      await song.save()
      songIds.push(song._id)
    }

    // Save the batch
    const batch = new Batch({ songs: songIds, user: req.params.userId })
    await batch.save()

    res.json(transformedData)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong.')
  }
})

//GET list of batches from "batches" collection
app.get('/:userId/batches', async (req, res) => {
  const { userId } = req.params.userId
  try {
    const response = await Batch.find({
      user: mongoose.Schema.Types.ObjectId(userId)
    })
    if (!response || response.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No batches found'
      })
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved batches',
      body: response
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error'
    })
  }
})

//GET list of songs from within a batch
app.get('/batch/:id', async (req, res) => {
  const { id } = req.params
  try {
    const response = await Batch.find({ _id: id })
    if (!response || response.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No batches found'
      })
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved batch',
      body: response
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error'
    })
  }
})

//POST liked song to remote DB in "likes" collection
app.post('/user/:userId/song/:id/like', async (req, res) => {
  const { id, userId } = req.params
  try {
    const song = await Song.findById(id)
    const user = await User.findById(userId)
    if (!song) {
      return res.status(404).json({
        status: 404,
        message: 'No song found with that ID'
      })
    }
    const like = new Like({
      title: song.title,
      artist: song.artist,
      popularity: song.popularity,
      spotify_id: song.spotify_id,
      previewURL: song.previewURL,
      user: userId
    })
    await like.save()
    user.likes.push(like)
    await user.save()

    res.status(200).json({
      status: 200,
      message: 'Successfully added song to likes',
      body: like
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error'
    })
  }
})

//DELETE entry from "likes" collection
app.delete('/like/:id', async (req, res) => {
  const { id } = req.params
  try {
    const like = await Like.findByIdAndDelete(id)
    if (!like) {
      return res.status(404).json({
        status: 404,
        message: 'No like found with that ID'
      })
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully removed entry from likes'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error'
    })
  }
})

//DELETE recommendation batch from "batches" collection
app.delete('/batch/:id', async (req, res) => {
  const { id } = req.params
  try {
    const batch = await Batch.findByIdAndDelete(id)
    if (!batch) {
      return res.status(404).json({
        status: 404,
        message: 'No batch found with that ID'
      })
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully removed batch'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Node server running on port:${PORT}`)
})
