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
    num: numJumps,
    heights: heights
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
