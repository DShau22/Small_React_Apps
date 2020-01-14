const date = new Date()

const jumpHeight = '3'
const jumpHangtime = '4'
const jumpBball = '5'
const run = 'R'
const walk = 'W'

const swimSet = new Set(['U', 'Y', 'O', 'F']) //fly back breast free
const jumpSet = new Set(['3', '4', '5'])
const stepSet = new Set(['R', 'W'])
// first entry of each set tells the activity
const activityNumber = 0

// jump[0]: '3' (report height), '4' (report hangtime), '5' (bball)
// jump[1]: hangtime in .02s
// jump[2]: ndata .02s, jump[3]: bs, jump[4]: # jumps, jump[5]: 10*(# baskets made)
function jumpJson(converted, today, userID) {
  const calcHeight = (hangtime) => {
    // truncate to nearest tenths digit
    return Math.floor(hangtime * hangtime * 2 * 10) / 10
  }
  var numJumps = 0
  var time = 0
  var heights = []
  converted.forEach(function(set) {
    // '3' '4' or '5' corresponds to jumping
    let string_rep = String.fromCharCode(set[activityNumber])
    if (jumpSet.has(string_rep)) {
      numJumps++
      time = set[2]
      heights.push(calcHeight(set[1])) //set[1] contains hangtime
    }
  })
  
  time = Math.round(time / 3000) // sampling rate is 1 sample/.02 seconds, now in minutes
  var json = {
    userID: userID,
    uploadDate: today,
    heights: heights,
    num: numJumps,
    time,
    calories: -1, //default for now since the algo doesn't write calories
  }
  // console.log(JSON.stringify(json))
  return json
}

// swim[0]: stroke, swim[1]: lap count, swim[2]: ndata in .1s, swim[3]: 55 or junk, 55 mean ended swim
// swim[4]: laptime, swim[5]: cals
function swimJson(converted, today, userID) {
  var calories = 0;
  var lapTimes = [];
  var strokes = [];
  var time = 0;
  converted.forEach(function(set) {
    // 1 corresponds to swimming
    let string_rep = String.fromCharCode(set[activityNumber])
    if (swimSet.has(string_rep)) {
      calories = set[5]
      time = set[2]
      lapTimes.push(set[4])
      strokes.push(set[0])
    }
  })
  time = Math.round(time / 600) //1 sample per .1 seconds, returns time in minutes
  var json = {
    userID: userID,
    uploadDate: today,
    num: strokes.length,
    calories,
    lapTimes,
    time,
    strokes,
  }
  return json
}

// run[0]: "R" for run, 'W' for walk, and more for other modes
// run[1]: time in minutes
// run[2]: ndata .1s
// run[3]: step count
// run[4]: time since start if you wanna report using pace, run[5]: cals
function runJson(converted, today, userID) {
  var numSteps = 0;
  var calories = 0;
  var time     = 0;
  var prevNumSteps = 0;
  var prevTime     = 0;
  var paces = [];

  converted.forEach(function(set) {

    let string_rep = String.fromCharCode(set[activityNumber])
    //console.log('running set: ', set)
    if (stepSet.has(string_rep)) {
      prevNumSteps = numSteps
      prevTime = time
      numSteps = set[3]
      calories = set[5]
      time     = set[2] / (600) // time in min
      pace = (numSteps - prevNumSteps) / (time - prevTime) // steps per min
      paces.push(pace)
    }
  })
  var json = {
    userID,
    uploadDate: today,
    num: numSteps,
    paces,
    calories,
    time,
  }
  // console.log(JSON.stringify(json))
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
