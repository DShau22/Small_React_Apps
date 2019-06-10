const IncomingForm = require('formidable').IncomingForm
const csv = require('csv')
var testCSV = csv()
const fs = require('fs')
const reader = require("./fileReaders/reader")
const jsonMaker = require("./jsonMaker")
const path = require("path")
const dataPath = "./Data/"
const jumpPath = "jump/"
const runPath = "run/"
const date = new Date()
const mongoose = require("mongoose")

// async function connectAndUpdate(prodCode, jumpJson, runJson, swimJson) {
//   await mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true })
//   mongoose.connection.once("open", function() {
//     console.log("successfully conncted to mongodb")
//   }).on("error", function(err) {
//     console.log("couldn't connect to mongodb", err)
//     throw err
//   })
//
//   var Users = mongoose.model("users", userSchema)
//   Users.estimatedDocumentCount(function(err, count) {
//     console.log("count is: ", count)
//   })
//
//   // or .findOneAndUpdate???
//   // rn id is 5cf5a8a91237280e69f68e1d
//   // product code is 29shf92ka0d91201asd
//   Users.update({productCode: prodCode}, {$push: {runJson: runJson, jumpJson: jumpJson, swimJson: swimJson}})
// }

module.exports = function upload(req, res) {
  var form = new IncomingForm()
  form.parse(req, function(err, fields, files) {
    if (err) throw err
    console.log("parsing form...")
    console.log("fields are: ", fields)
    console.log("files are: ", files)

    var userID = fields.id
    var prodCode = fields.prodCode
    var filePath = files.uploadedFile.path
    const idPath = userID + "/"
    // returns promise to convert encoded file to correct byte file
    var convertProm = reader.readEncoded(filePath)

    convertProm.then(function(converted) {
      console.log(".then is being run")
      var activityJson = jsonMaker.toJson(converted)
      var jumpJson = activityJson.jumpJson
      var runJson = activityJson.runJson
      var swimJson = activityJson.swimJson

      var currentDate = "" + (date.getMonth() + 1) + "_" + date.getDate() + "_" + date.getFullYear()

      // REPLACE WITH UPDATING DATABASE
      fs.writeFileSync(dataPath + idPath + jumpPath + currentDate + "_JUMPS" + ".json", JSON.stringify(jumpJson))
      fs.writeFileSync(dataPath + idPath + runPath + currentDate + "_RUN" + ".json", JSON.stringify(runJson))

      // connectAndUpdate(prodCode, jumpJson, runJson, swimJson)

      res.end()
    })
    convertProm.catch(function(err) {
      console.log("the promise was rejected :(")
      throw err
    })
  })
}
