const IncomingForm = require('formidable').IncomingForm
const fs = require("fs");
const dataPath = "./Data/"
const jumpPath = "jump/"
const runPath = "run/"
module.exports = {
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
