const express = require('express')
const cors = require('cors')
const upload = require('./upload')
const retrieve = require('./retrieve')
const server = express()
const mongo = require('mongodb')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/testdb')
mongoose.connection.once("open", function() {
  console.log("successfully conncted to mongodb")
}).on("error", function(err) {
  console.log("couldn't connect to mongodb", err)
  throw err
})
var corsOptions = {
  // origin: '*',
  origin: 'localhost:3000',
  optionsSuccessStatus: 200,
}

server.use(cors(corsOptions))

// server.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'))
// })

server.post('/upload', upload)
server.get('/data', retrieve.getUserProgress)

server.listen(8080, () => {
  console.log('Server started!')
})
