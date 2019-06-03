const express = require('express')
const cors = require('cors')
const upload = require('./upload')
const retrieve = require('./retrieve')
const server = express()

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

server.use(cors(corsOptions))

// server.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'))
// })

server.post('/upload', upload)
// server.get('/data/jump', retrieve.getUserJumpProgress)
// server.get('/data/run', retrieve.getUserRunProgress)
server.get('/data', retrieve.getUserProgress)

server.listen(8080, () => {
  console.log('Server started!')
})
