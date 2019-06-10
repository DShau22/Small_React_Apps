const express = require('express')
const cors = require('cors')
const upload = require('./upload')
const retrieve = require('./retrieve')
const server = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')
const userSchema = require('./database/MongoConfig')
const userJson = require("./database/sampleUser")

var corsOptions = {
  // origin: '*',
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
}

server.use(cors(corsOptions))

server.post('/upload', upload)
server.get('/data', retrieve.getUserProgress)

server.listen(8080, () => {
  console.log('Server started!')
})
