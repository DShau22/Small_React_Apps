const mongo = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jumpSchema = new Schema({
  uploadDate: Date,
  numJumps: Number,
  heights: [Number],
  calories: Number,
})

const runSchema = new Schema({
  uploadDate: Date,
  numSteps: Number,
  time: Number,
  calories: Number,
})

const swimSchema = new Schema({
  uploadDate: Date,
  numLaps: Number,
  lapTimes: [Number],
  strokes: [String],
  calories: Number,
})

const userSchema = new Schema({
  name: String,
  productCode: String,
  registerDate: Date,
  jump: [jumpSchema],
  run: [runSchema],
  swim: [swimSchema],
})

module.exports = userSchema
