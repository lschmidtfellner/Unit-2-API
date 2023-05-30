//import modules
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'

//env variables
const DATABASE_URI = process.env.DATABASE_URI
const ENVIRONMENT = process.argv[2] || process.env.ENVIRONMENT

//config env
dotenv.config()

mongoose.Promise = Promise;

let db = mongoose.connection

mongoose
  .connect(DATABASE_URI, { useNewUrlParser: true })
  .then(instance =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch(err => console.log("Connection Failed.", err));

export default db
