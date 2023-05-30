//import modules
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'

//config env
dotenv.config()

//env variables
const DATABASE_URI = process.env.DATABASE_URI
const ENVIRONMENT = process.argv[2] || process.env.ENVIRONMENT
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

//access spotify API
const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

async function getAccessToken() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                'grant_type': 'client_credentials'
            }),
        });
        return response.data.access_token;
    } catch (error) {
        console.error(error);
    }
}

mongoose.Promise = Promise;
let db = mongoose.connection

mongoose
  .connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(instance =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch(err => console.log("Connection Failed.", err));

export { getAccessToken, db }
