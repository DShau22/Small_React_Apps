const IncomingForm = require('formidable').IncomingForm
const fs = require("fs");
const dataPath = "./Data/"
const jumpPath = "jump/"
const runPath = "run/"
const mongoConfig = require("./database/MongoConfig")
const mongoose = require('mongoose')

function getConfigSchema(activity) {
  switch(activity) {
    case "jump":
      return mongoConfig.jumpSchema
    case "run":
      return mongoConfig.runSchema
    case "swim":
      return mongoConfig.swimSchema
  }
}

module.exports = {
  getFromDatabase: function getFromDatabase(request, response) {
    var form = new IncomingForm()

    // 12345 for now...
    var userID = request.get("userID")
    //jumps, runs, swims
    var activity = request.get("activity")

    // establish connection to mongoose and query the latest upload. Change -1
    // to 1 to get the oldest
    var ActivityData = mongoose.model(activity, getConfigSchema(activity))

    // don't include the __v:, uploadDate, userID, _id fields
    var projection = {__v: false, uploadDate: false, userID: false, _id: false}
    ActivityData.findOne({userID: userID}, projection).sort({'uploadDate': -1}).exec(function(err, data) {
      if (err) throw err
      console.log("queried result is: ", data)

      // Define to JSON type
      var jsonContent = JSON.parse(JSON.stringify(data))
      form.parse(request)
      // send request object with queried data written to the body
      form.on("end", () => {
        response.writeHead(200, {"Content-Type": "application/json"})
        response.write(JSON.stringify(jsonContent))
        response.end()
      })
    })
  },

  //outdated, assumes there's a file system
  getUserProgress: function getUserProgress(request, response) {
    var form = new IncomingForm()

    var userID = request.get("id")
    var activity = request.get("activity")
    var idPath = userID + "/"

    var userPath = dataPath + idPath + activity + "/"
    var userFiles = fs.readdirSync(userPath)

    var latestUpload = userFiles.reduce(function(prev, curr) {
      var prevCreateTime = fs.statSync(userPath + prev).birthtimeMs
      var currCreateTime = fs.statSync(userPath + curr).birthtimeMs
      return prevCreateTime < currCreateTime ? curr : prev
    })
    // Get content from file
    var contents = fs.readFileSync(userPath + latestUpload)
    // Define to JSON type
    var jsonContent = JSON.parse(contents)
    form.parse(request)
    form.on("end", () => {
      response.writeHead(200, {"Content-Type": "application/json"})
      response.write(JSON.stringify(jsonContent))
      response.end()
    })
  }
}
