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
const jwt = require("jsonwebtoken")
const secret = 'secretkey'

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

function update(jumpJson, runJson, swimJson) {

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

  console.log("run", newRunData, "jump", newJumpData, "swim", newSwimData)
  var errors = { success: true, msgs: [] }
  //save to database collections runs, jumps, swims
  if (newRunData !== null) {
    newRunData.save(function (err, run) {
      if (err) {
        console.error(err)
        errors.success = false
        errors.msgs.push(err.toString())
      }
      console.log("saved run data")
    })
  } else {
    console.log("run data is null. Either there was a bug with the upload or it didn't fit the schema")
  }

  if (newJumpData !== null) {
    newJumpData.save(function (err, jump) {
      if (err) {
        console.error(err)
        errors.success = false
        errors.msgs.push(err.toString())
      }
      console.log("saved jump data")
    })
  } else {
    console.log("jump data is null. Either there was a bug with the upload or it didn't fit the schema")
  }

  if (newSwimData !== null) {
    newSwimData.save(function (err, swim) {
      if (err){
        console.error(err)
        errors.success = false
        errors.msgs.push(err.toString())
      }
      console.log("saved swim data")
    })
  } else {
    console.log("swim data is null. Either there was a bug with the upload or it didn't fit the schema")
  }
  return errors
}

function parseAuthHeader(auth) {
  const bearer = auth.split(' ');
  // Get token from array
  const bearerToken = bearer[1];
  return bearerToken
}

module.exports = function upload(req, res) {

  var form = new IncomingForm()
  form.parse(req, function(err, fields, files) {
    if (err) throw err
    console.log("parsing form...")
    var filePath = files.uploadedFile.path
    // returns promise to convert encoded file to correct byte file
    var convertProm = reader.readEncoded(filePath)

    convertProm.then(function(converted) {
      jwt.verify(parseAuthHeader(req.headers['authorization']), secret, function(err, decoded) {
        console.log("decoded is: ", decoded)
        // pass the converted byte file and the decoded _id to make activity jsons
        var activityJson = jsonMaker.toJson(converted, decoded._id)
        var jumpJson = activityJson.jumpJson
        var runJson = activityJson.runJson
        var swimJson = activityJson.swimJson

        var result = update(jumpJson, runJson, swimJson)
        if (result.success) {
          res.send({
            success: true
          })
        } else {
          // something went wrong with uploading the database. Probably schema didn't match
          res.status(500).send(result)
        }
        res.end()
      })
    })
    convertProm.catch(function(err) {
      console.log("the promise was rejected :(")
      throw err
    })
  })
}
