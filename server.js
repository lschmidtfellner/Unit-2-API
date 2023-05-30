//import dependencies

import mongoose from 'mongoose'
import mongodb from 'mongodb'
import express from 'express'
import * as dotenv from 'dotenv'
import axios from 'axios'
import db from './db/connection.js'

//config
dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(express.json())

//models
import Song from './models/song.js'

//GET individual song information from spotify

//GET recommendations array based on individual song info

//GET list of batches from "batches" collection

//GET list of songs from within a batch

//POST results to remote DB collection as one document in "batches" collection

//POST liked songs to remote DB collection in "likes" collection

//DELETE entry from "likes" collection

//DELETE recommendation batch from "batches" collection


app.listen(PORT, () => {
  console.log(`Node server running on port:${PORT}`)
})