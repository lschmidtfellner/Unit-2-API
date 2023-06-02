import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { db } from './db/connection.js'
import routes from './routes.js'

dotenv.config()
const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use(cors({origin: '*'}))

// Import and use routes
app.use('/', routes)
// app.get('/', (req, res) => {res.send('Please specify a route')})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
