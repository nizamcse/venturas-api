//const functions = require("firebase-functions");
const http = require('http')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

try {
  mongoose.connect(process.env.MONGO_ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('Successfully connected Mongo Atlas Production')
} catch (e) {
  console.log('Mongo Atlas connection error:', e)
}


const app = require('./app')
const port = process.env.PORT || 5000
const server = http.createServer(app)
server.listen(port, () => {
  console.log(`Server started to: http://localhost:${port}/`)
})

//exports.app = functions.https.onRequest(app);
