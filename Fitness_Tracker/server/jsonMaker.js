const date = new Date()
const fs = require('fs')

function jumpJson(converted, today, userID) {
  var numJumps = 0
  var heights = []
  converted.forEach(function(set) {
    if (set[0] === 3) {
      numJumps++
      heights.push(set[4] / 100) //set[4] contains height in .01 inches
    }
  })
  var json = {
    userID: userID,
    uploadDate: today,
    heights: heights,
    num: numJumps,
    calories: -1, //default for now since the algo doesn't write calories
  }
  console.log(JSON.stringify(json))
  return json
}
//[sport, stroke (U, B, R, F), ndata, lap time, calories]
function swimJson(converted, today, userID) {
  var numLaps = 0,
      calories = 0,
      lapTimes = [],
      strokes = []
  converted.forEach(function(set) {
    if (set[0] === 1) {
      calories = set[4]
      lapTimes.push(set[3])
      strokes.push(set[1])
    }
  })
  numLaps = strokes.length
  var json = {
    userID: userID,
    uploadDate: today,
    num: numLaps,
    calories: calories,
    lapTimes: lapTimes,
    strokes: strokes
  }
  return json
}


function runJson(converted, today, userID) {
  var numSteps = 0,
      calories = 0,
      time     = 0

  converted.forEach(function(set) {
    if (set[0] === 2) {
      numSteps = set[3]
      calories = set[4]
      time     = set[1]
    }
  })
  var json = {
    userID: userID,
    uploadDate: today,
    num: numSteps,
    calories: calories,
    time: time
  }
  console.log(JSON.stringify(json))
  return json
}

module.exports = {
  toJson: function toJson(converted, userID) {
    // gets the current time for the registration date
    var todayMil = date.getTime()
    var today = new Date(todayMil)

    var json = {
      jumpJson: jumpJson(converted, today, userID),
      runJson: runJson(converted, today, userID),
      swimJson: swimJson(converted, today, userID)
    }
    return json
  }
}
