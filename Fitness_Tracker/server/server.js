const express = require('express')
const cors = require('cors')
const upload = require('./upload')
const retrieve = require('./retrieve')
const server = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')
const userSchema = require('./database/MongoConfig')
const userJson = require("./database/sampleUser")

// configure and use cors options
var corsOptions = {
  // origin: '*',
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}
server.use(cors(corsOptions))

// add route methods
server.post('/upload', upload)
server.get('/data', retrieve.getFromDatabase)

// set up a connection to database
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true, useFindAndModify: false })
mongoose.connection.once("open", function() {
  console.log("successfully connected to mongo")
  server.listen(8080, () => {
    console.log('Server started!')
  })
})
