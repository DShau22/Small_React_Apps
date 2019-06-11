const mongo = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jumpSchema = new Schema({
  userID: String,
  uploadDate: Date,
  num: Number,
  heights: [Number],
  calories: Number,
})

const runSchema = new Schema({
  userID: String,
  uploadDate: Date,
  num: Number,
  time: Number,
  calories: Number,
})

const swimSchema = new Schema({
  userID: String,
  uploadDate: Date,
  num: Number,
  lapTimes: [Number],
  strokes: [String],
  calories: Number,
})

const userSchema = new Schema({
  userID: String,
  name: String,
  userName: String,
  password: String,
  productCode: String,
  registerDate: Date,
})

module.exports = {
  userSchema: userSchema,
  jumpSchema: jumpSchema,
  runSchema: runSchema,
  swimSchema: swimSchema
}
