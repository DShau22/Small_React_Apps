const IncomingForm = require('formidable').IncomingForm
const csv = require('csv')
var testCSV = csv()
const fs = require('fs')
const reader = require("./fileReaders/reader")
const jsonMaker = require("./jsonMaker")
const dataPath = "./Data/"
const jumpPath = "jump/"
const runPath = "run/"
const date = new Date()

module.exports = function upload(req, res) {
  var form = new IncomingForm()
  form.parse(req, function(err, fields, files) {
    if (err) throw err
    console.log("parsing form...")
    console.log("fields are: ", fields)
    console.log("files are: ", files)

    var userID = fields.id
    var filePath = files.uploadedFile.path
    const idPath = userID + "/"
    // returns promise to convert encoded file to correct byte file
    var convertProm = reader.readEncoded(filePath)

    convertProm.then(function(converted) {
      console.log(".then is being run")
      var activityJson = jsonMaker.toJson(converted)
      var jumpJson = activityJson.jumpJson
      var runJson = activityJson.runJson

      var currentDate = "" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getFullYear()
      console.log("writing file to: ", dataPath + idPath + currentDate + "_JUMPS" + ".json")
      fs.writeFileSync(dataPath + idPath + jumpPath + currentDate + "_JUMPS" + ".json", JSON.stringify(jumpJson))
      fs.writeFileSync(dataPath + idPath + runPath + currentDate + "_RUN" + ".json", JSON.stringify(runJson))
      res.end()
    })
    convertProm.catch(function(err) {
      console.log("the promise was rejected :(")
      throw err
    })
  })
}
