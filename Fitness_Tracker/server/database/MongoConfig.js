const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema

const JumpSchema = new Schema({
  email: String,
  uploadDate: Date,
  num: Number,
  heights: [Number],
  calories: Number,
})

const RunSchema = new Schema({
  email: String,
  uploadDate: Date,
  num: Number,
  time: Number,
  calories: Number,
})

const SwimSchema = new Schema({
  email: String,
  uploadDate: Date,
  num: Number,
  lapTimes: [Number],
  strokes: [String],
  calories: Number,
})

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }, // will search by email
  },
  password: {
    type: String,
    default: ''
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  productCode: {
    type: String,
    required: true,
    default: ''
  },
  registerDate: {
    type: Date,
    default: new Date('January 1, 1970 00:00:00'),
  },
})
// security for passwords
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const UserSessionSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: new Date('January 1, 1970 00:00:00')
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model('user', UserSchema)
const Swim = mongoose.model('swim', SwimSchema)
const Run = mongoose.model('run', RunSchema)
const Jump = mongoose.model('jump', JumpSchema)

const UserSession = mongoose.model('session', UserSessionSchema)

module.exports = {
  User,
  Jump,
  Run,
  Swim,
  UserSession
}
