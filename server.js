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

//spotify routes

//GET recommendations route


app.listen(PORT, () => {
  console.log(`Node server running on port:${PORT}`)
})