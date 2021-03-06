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
    default: 0,
  },
  heights: {
    type: [Number],
    required: true,
    default: [],
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
  time: {
    type: Number,
    required: true,
    default: 0
  }
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
  paces: {
    type: Array,
    required: true,
    default: []
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
  time: {
    type: Number,
    required: true,
    default: 0
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
    required: false,
    default: ''
  },
  registerDate: {
    type: Date,
    required: false,
    default: new Date('January 1, 1970 00:00:00'),
  },
  registered: {
    type: Boolean,
    required: false,
    default: false,
  },
  age: {
    type: Number,
    required: false,
    default: -1
  },
  friendsPending: {
    type: Array,
    required: false,
    default: []
  },
  friendRequests: {
    type: Array,
    required: false,
    default: []
  },
  friends: {
    type: Array,
    required: false,
    default: []
  },
  bio: {
    type: String,
    required: false,
    default: ""
  },
  height: {
    type: String,
    required: false,
    default: ""
  },
  weight: {
    type: String,
    required: false,
    default: ""
  },
  gender: {
    type: String,
    required: false,
    default: ""
  },
  profilePicture: {
    type: Object,
    required: false,
    default: {
      profileURL: "",
      etag: ""
    }
  },
  location: {
    type: String,
    required: false,
    default: ""
  },
  bests: {
    type: Object,
    required: true,
    default: {
      jump: 0,
      run: 0,
      swim: {}
    }
  },
  totals: {
    type: Object,
    required: true,
    default: {
      steps: 0,
      laps: 0,
      verticalJumps: 0,
      shotsTaken: 0,
      buckets: 0,
      jumpRopes: 0,
      sessions: 0,
      minutes: 0,
      calories: 0,
    }
  },
  settings: {
    type: Object,
    required: true,
    default: {
      unitSystem: "English", // English, metric
      swimLap: "25 yd", // 25 yd, 50 m, 25 m, or some custom text like 33.3 yd
      seeFriendsList: "everyone", //everyone, friends, just me
      seeFitness: "everyone", //everyone, friends, just me
      seeBasicInfo: "everyone", //everyone, friends, just me
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
