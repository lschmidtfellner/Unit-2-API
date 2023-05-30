//import dependencies

import mongoose from 'mongoose'
import mongodb from 'mongodb'
import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'
import {db} from './db/connection.js'

import { getAccessToken } from './db/connection.js'

//config
dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(express.json())

//models
import Song from './models/song.js'
import Batch from './models/batch.js'

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
  const { artist, song } = req.query;
  const query = `track:${song} artist:${artist}`;
  const accessToken = await getAccessToken()

  try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
          params: {
              q: query,
              type: 'track',
              limit: 1
          }
      });

      const tracks = response.data.tracks.items;
      if (tracks.length > 0) {
          res.json(tracks[0]);
      } else {
          res.status(404).send('No songs found.');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong.');
  }
});

//GET recommendations array based on individual song info
app.get('/recommendations', async (req, res) => {
  const accessToken = await getAccessToken()
  let { seed_artists, seed_tracks, seed_genres, max_popularity } = req.query;
  
  // Convert to arrays in case single values are provided
  if(seed_artists) seed_artists = seed_artists.split(',')
  if(seed_tracks) seed_tracks = seed_tracks.split(',')
  if(seed_genres) seed_genres = seed_genres.split(',')
  
  if(!seed_artists && !seed_tracks && !seed_genres) {
    res.status(400).send('You must provide at least one of seed_artists, seed_tracks, or seed_genres.');
    return;
  }
  
  const params = {};
  if(seed_artists) params.seed_artists = seed_artists.join(',')
  if(seed_tracks) params.seed_tracks = seed_tracks.join(',')
  if(seed_genres) params.seed_genres = seed_genres.join(',')
  if(max_popularity) params.max_popularity = max_popularity
  
  try {
      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
          params
      });

      // Transform data before sending response
      const transformedData = response.data.tracks.map(track => ({
        song_name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        popularity: track.popularity,
        id: track.id,
        title: track.name, // assuming 'title' is equivalent to the song name
        previewURL: track.preview_url, // use the track's preview_url field
      }));

      // Save to MongoDB
      const songIds = []
      for (let songData of transformedData) {
        const song = new Song(songData);
        await song.save();
        songIds.push(song._id);
      }

      // Save the batch
      const batch = new Batch({ songs: songIds });
      await batch.save();

      res.json(transformedData);
  } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong.');
  }
});


//GET list of batches from "batches" collection
app.get('/batches', async (req, res) => {
  try {
    const response = await Batch.find()
    if (!response || response.length === 0) {
        return res.status(404).json({
            status: 404,
            message: 'No batches found'
        });
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

//POST results to remote DB collection as one document in "batches" collection

//POST liked songs to remote DB collection in "likes" collection

//DELETE entry from "likes" collection

//DELETE recommendation batch from "batches" collection

app.listen(PORT, () => {
  console.log(`Node server running on port:${PORT}`)
})
