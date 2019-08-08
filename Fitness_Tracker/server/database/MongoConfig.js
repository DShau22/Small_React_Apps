const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema

const JumpSchema = new Schema({
  userID: {
    type: String,
    required: true,
    default: '',
  },
  uploadDate: {
    type: Date,
    required: true,
    default: '',
  },
  num: {
    type: Number,
    required: true,
    default: -1,
  },
  heights: {
    type: [Number],
    required: true,
    default: [],
  },
  calories: {
    type: Number,
    required: true,
    default: -1,
  },
})

const RunSchema = new Schema({
  userID: {
    type: String,
    required: true,
    default: '',
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  num: {
    type: Number,
    required: true,
    default: 0,
  },
  time: {
    type: Number,
    required: true,
    default: 0,
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
})

const SwimSchema = new Schema({
  userID: {
    type: String,
    required: true,
    default: '',
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  num: {
    type: Number,
    required: true,
    default: 0,
  },
  lapTimes: {
    type: [Number],
    required: true,
    default: [],
  },
  strokes: {
    type: [String],
    required: true,
    default: [],
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
})

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }, // will search by email
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: ''
  },
  firstName: {
    type: String,
    required: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    default: ''
  },
  productCode: {
    type: String,
    required: true,
    default: ''
  },
  registerDate: {
    type: Date,
    required: true,
    default: new Date('January 1, 1970 00:00:00'),
  },
  registered: {
    type: Boolean,
    required: true,
    default: false,
  },
  friendsPending: {
    type: Array,
    required: true,
    default: []
  },
  friendRequests: {
    type: Array,
    required: true,
    default: []
  },
  friends: {
    type: Array,
    required: true,
    default: []
  },
  bio: {
    type: String,
    required: true,
    default: ""
  },
  height: {
    type: Number,
    required: true,
    default: 0
  },
  weight: {
    type: Number,
    required: true,
    default: 0
  },
  gender: {
    type: String,
    required: true,
    default: ""
  },
  profilePicture: {
    type: Object,
    required: true,
    default: {
      profileURL: "",
      etag: ""
    }
  },
  unitSystem: {
    type: String,
    required: true,
    default: "English"
  },
  location: {
    type: String,
    required: true,
    default: ""
  },
  settings: {
    type: Object,
    require: true,
    default: {
      unitSystem: "English"
    }
  }
})

//add text indices for searching
UserSchema.index({firstName: 'text', lastName: 'text'})

// security for passwords
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('user', UserSchema)
const Swim = mongoose.model('swim', SwimSchema)
const Run = mongoose.model('run', RunSchema)
const Jump = mongoose.model('jump', JumpSchema)

module.exports = {
  User,
  Jump,
  Run,
  Swim,
}
