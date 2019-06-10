function jumpJson(converted) {
  var numJumps = 0
  var heights = []
  converted.forEach(function(set) {
    if (set[0] === 3) {
      numJumps++
      heights.push(set[4] / 100) //set[4] contains height in .01 inches
    }
  })
  var json = {
    heights: heights,
    num: numJumps,
  }
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
  var json = {
    num: numLaps,
    calories: calories,
    lapTimes: lapTimes,
    strokes: strokes
  }
  console.log(JSON.stringify(json))
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
  var json = {
    num: numSteps,
    calories: calories,
    time: time
  }
  console.log(JSON.stringify(json))
  return json
}

module.exports = {
  toJson: function toJson(converted) {
    var json = {
      jumpJson: jumpJson(converted),
      runJson: runJson(converted),
    }
    return json
  }
}
