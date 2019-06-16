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

const {User, Swim, Run, Jump} = require("./database/MongoConfig")

const samples = require("./database/samples")

function addSampleUser() {

  //create new doc instance with model and Schema
  var newUser = new User(samples.userJson)

  //save to database
  newUser.save(function (err, user) {
    if (err) return console.error(err)
  })
}

function addSampleRun() {

  //create new doc instance with model and Schema
  var newRunData = new Run(samples.runJson)

  //save to database
  newRunData.save(function (err, user) {
    if (err) return console.error(err)
  })
}

function addSampleJump() {
  //create new doc instance with model and Schema
  var newJumpData = new Jump(samples.jumpJson)

  //save to database
  newJumpData.save(function (err, user) {
    if (err) return console.error(err)
  })
}

function addSampleSwim() {
  //create new doc instance with model and Schema
  var newSwimData = new Swim(samples.swimJson)

  //save to database
  newSwimData.save(function (err, user) {
    if (err) return console.error(err)
  })
}

function update(userID, jumpJson, runJson, swimJson) {
  // establish models for runs, jumps, swims collections

  console.log("swimJson: ", swimJson)
  console.log("runJson: ", runJson)
  console.log("jumpJson: ", jumpJson)
  // addSampleUser()
  // addSampleRun()
  // addSampleJump()
  // addSampleSwim()

  // create documents using the jsons from the request body
  var newRunData = (runJson === null) ? null : new Run(runJson)
  var newJumpData = (jumpJson === null) ? null : new Jump(jumpJson)
  var newSwimData = (swimJson === null) ? null : new Swim(swimJson)

  //save to database collections runs, jumps, swims

  if (newRunData !== null) {
    newRunData.save(function (err, run) {
      if (err) return console.error(err)
    })
  }
  if (newJumpData !== null) {
    newJumpData.save(function (err, jump) {
      if (err) return console.error(err)
    })
  }
  if (newSwimData !== null) {
    newSwimData.save(function (err, swim) {
      if (err) return console.error(err)
    })
  }
}

module.exports = function upload(req, res) {
  var form = new IncomingForm()
  form.parse(req, function(err, fields, files) {
    if (err) throw err
    console.log("parsing form...")
    console.log("fields are: ", fields)
    // console.log("files are: ", files)

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
      var swimJson = activityJson.swimJson

      // REPLACE WITH UPDATING DATABASE
      // fs.writeFileSync(dataPath + idPath + jumpPath + currentDate + "_JUMPS" + ".json", JSON.stringify(jumpJson))
      // fs.writeFileSync(dataPath + idPath + runPath + currentDate + "_RUN" + ".json", JSON.stringify(runJson))
      // addSampleUser()
      update(userID, jumpJson, runJson, swimJson)

      res.end()
    })
    convertProm.catch(function(err) {
      console.log("the promise was rejected :(")
      throw err
    })
  })
}
