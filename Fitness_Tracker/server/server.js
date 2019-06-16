const express = require('express')
const cors = require('cors')
const server = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')

const upload = require('./upload')
const retrieve = require('./retrieve')
const userSchema = require('./database/MongoConfig')
const userJson = require("./database/sampleUser")
const router = require("./routes/loginServer")

// configure and use cors options
var corsOptions = {
  // origin: '*',
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}
server.use(cors(corsOptions))

// make sure to enable body parser for req and res bodies
server.use(express.urlencoded({ extended: true }))
server.use(express.json())

// routes for login and sign up
server.use('/', router)

// add route methods for dashboard
server.post('/upload', upload)
server.get('/data', retrieve.getFromDatabase)

// set up a connection to database
mongoose.connect('mongodb://localhost:27017/tracker_dev', { useNewUrlParser: true, useFindAndModify: false })
  .catch(function(err) {throw err})

mongoose.connection.once("open", function() {
  console.log("successfully connected to mongo")
  server.listen(8080, () => {
    console.log('Server started!')
  })
})
