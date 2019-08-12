const date = new Date()
const fs = require('fs')

const jumpNumber = 3
const runNumber = 2
const swimNumber = 1
// first entry of each set tells the activity
const activityNumber = 0

// for jump, its [sport, num jumps, ndata, hangtime, height in .01 inches]
function jumpJson(converted, today, userID) {
  var numJumps = 0
  var time = 0
  var heights = []
  converted.forEach(function(set) {
    // 3 corresponds to jumping
    if (set[activityNumber] === jumpNumber) {
      numJumps++
      time = ndata
      heights.push(set[4] / 100) //set[4] contains height in .01 inches
    }
  })
  time = Math.round(ndata / 50) // sampling rate is 1 sample/.02 seconds
  var json = {
    userID: userID,
    uploadDate: today,
    heights: heights,
    num: numJumps,
    time,
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
      strokes = [],
      time = 0
  converted.forEach(function(set) {
    // 1 corresponds to swimming
    if (set[activityNumber] === swimNumber) {
      calories = set[4]
      time = set[2]
      lapTimes.push(set[3])
      strokes.push(set[1])
    }
  })
  time = Math.round(time / 10) //1 sample per .1 seconds
  numLaps = strokes.length
  var json = {
    userID: userID,
    uploadDate: today,
    num: numLaps,
    calories: calories,
    lapTimes: lapTimes,
    time,
    strokes: strokes
  }
  return json
}

// run: [sport, time walking, ndata, step count, calories]
function runJson(converted, today, userID) {
  var numSteps = 0,
      calories = 0,
      time     = 0
  var prevNumSteps = 0,
      prevTime     = 0
  var paces = []
  converted.forEach(function(set) {
    // 2 corresponds to running
    if (set[activityNumber] === runNumber) {
      prevNumSteps = numSteps
      prevTime = time
      numSteps = set[3]
      calories = set[4]
      time     = set[1]
      pace = (numSteps - prevNumSteps) / (time - prevTime)
      paces.push(pace)
    }
  })
  time = Math.round(time / 10) // 1 sample per .1 seconds
  var json = {
    userID,
    uploadDate: today,
    num: numSteps,
    paces,
    calories,
    time,
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
