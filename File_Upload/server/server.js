const express = require('express')
const cors = require('cors')
const upload = require('./upload')

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

server.listen(8080, () => {
  console.log('Server started!')
})
