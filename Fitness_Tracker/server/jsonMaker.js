const date = new Date()
var todayMil = date.getTime()
var today = new Date(todayMil)

function jumpJson(converted) {
  var numJumps = 0
  var heights = []
  converted.forEach(function(set) {
    if (set[0] === 3) {
      numJumps++
      heights.push(set[4] / 100) //set[4] contains height in .01 inches
    }
  })
  var json = (numJumps === 0 ? null : {
    heights: heights,
    num: numJumps,
    uploadDate: today
  })
  console.log(JSON.stringify(json))
  return json
}
//[sport, stroke (U, B, R, F), ndata, lap time, calories]
function swimJson(converted) {
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
  var json = (numLaps === 0 ? null : {
    num: numLaps,
    calories: calories,
    lapTimes: lapTimes,
    strokes: strokes,
    uploadDate: today,
  })
  // console.log(JSON.stringify(json))

  //hard coded for now...
  // json = {
  //   num: 5,
  //   lapTimes: [12, 13, 14, 15, 16],
  //   strokes: ["U", "U", "U", "U", "U"],
  //   calories: 21,
  //   uploadDate: today,
  // }
  return json
}


function runJson(converted) {
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
  var json = (numSteps === 0 ? null : {
    num: numSteps,
    calories: calories,
    time: time,
    uploadDate: today,
  })
  console.log(JSON.stringify(json))
  return json
}

module.exports = {
  toJson: function toJson(converted) {
    var json = {
      jumpJson: jumpJson(converted),
      runJson: runJson(converted),
      swimJson: swimJson(converted),
    }
    return json
  }
}
