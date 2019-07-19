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

function update(jumpJson, runJson, swimJson) {

  console.log("swimJson: ", swimJson)
  console.log("runJson: ", runJson)
  console.log("jumpJson: ", jumpJson)

  // create documents using the jsons from the request body
  // return null if the number is 0 (user didn't do any activity)
  var newRunData = (runJson.num === 0) ? null : new Run(runJson)
  var newJumpData = (jumpJson.num === 0) ? null : new Jump(jumpJson)
  var newSwimData = (swimJson.num === 0) ? null : new Swim(swimJson)

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
        // invalid token!
        if (err) {
          return res.send({
            success: false,
            message: err.toString()
          })
        }

        console.log("decoded is: ", decoded)
        // pass the converted byte file and the decoded _id to make activity jsons
        var activityJson = jsonMaker.toJson(converted, decoded._id)
        var jumpJson = activityJson.jumpJson
        var runJson = activityJson.runJson
        var swimJson = activityJson.swimJson

        var result = update(jumpJson, runJson, swimJson)
        if (result.success) {
          return res.send({
            success: true
          })
        } else {
          // something went wrong with uploading the database. Probably schema didn't match
          return res.status(500).send(result)
        }
      })
    })
    convertProm.catch(function(err) {
      console.log("something went wrong with reading the encoded file")
      throw err
    })
  })
}
