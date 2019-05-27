const IncomingForm = require('formidable').IncomingForm
const csv = require('csv')
var testCSV = csv()
const fs = require('fs')

function MyCSV(col1, col2, col3) {
  this.col1 = col1
  this.col2 = col2
  this.col3 = col3
}

module.exports = function upload(req, res) {
  console.log("request url is: " + req.url)
  var form = new IncomingForm()
  form.parse(req, function(err, fields, files) {
    console.log("parsing form...")
    var filePath = files.uploadedFile.path
    var bool = true

    var readCSV = new Promise((resolve, reject) => {
      // for (var index = 0; index < 1001; index++) {
      //   bool = !bool
      // }
      // if (bool) {
      //   resolve(23)
      // } else {
      //   reject(14)
      // }
      var myData = []
      testCSV.from.path(filePath).to.array(function (data) {
          for (var index = 0; index < data.length; index++) {
              console.log("index is: " + index)
              myData.push(new MyCSV(data[index][0], data[index][1], data[index][2]))
          }
          console.log(myData[0])
          if (myData === undefined || myData.length == 0) {
            reject()
          } else {
            resolve(myData)
          }
      })
    })

    readCSV.then(function(myData) {
      console.log(".then is being run")
      let csvData = {
        col1: myData[0].col1,
        col2: myData[0].col2,
        col3: myData[0].col3
      }
      let savedJson = JSON.stringify(csvData)
      fs.writeFileSync("./Data/testJson.json", savedJson)
      res.end()
    }).catch(function() {
      console.log("the promise was rejected :(")
    })
  })

  // form.on('file', (name, file) => {
  //   console.log("uploaded file!")
  //   testCSV.from.path(file.path).to.array(function (data) {
  //       for (var index = 0; index < data.length; index++) {
  //           console.log("index is: " + index)
  //           myData.push(new MyCSV(data[index][0], data[index][1], data[index][2]))
  //       }
  //       console.log(myData)
  //   })
  //   // fs.readFile(file.path, 'utf8', (err, contents) => {
  //   //   console.log("contents are being read...")
  //   //   console.log(contents)
  //   // })
  //   console.log("after calling readFile()")
  // })
  //
  // form.on('end', () => {
  //   res.json({ col1: myData[0].col1,
  //               col2: myData[0].col2,
  //               col3: myData[0].col3})
  // })
}
