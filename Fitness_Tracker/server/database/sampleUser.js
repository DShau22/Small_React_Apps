
var userJson = {
  name: "David",
  productCode: "29shf92ka0d91201asd",
  registerDate: new Date('December 17, 1995 03:24:00'),
  jump: {
    uploadDate: new Date('December 25, 1995 03:24:00'),
    numJumps: 5,
    heights: [13.4, 12.3, 16.7, 12, 6.7],
    calories: 26,
  },
  run: {
    uploadDate: new Date('December 12, 1995 03:24:00'),
    numSteps: 1500,
    time: 120,
    calories: 12,
  },
  swim: {
    uploadDate: new Date('December 11, 1995 03:24:00'),
    numLaps: 5,
    lapTimes: [12, 13, 14, 15, 16],
    strokes: ["U", "B", "R", "F", "U"],
    calories: 21
  },
}

module.exports = userJson
