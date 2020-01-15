const express = require('express')
const router = express.Router()

const jwt = require("jsonwebtoken")
const secret = 'secretkey'

// imports for mongo
const mongoConfig = require("../../database/MongoConfig")
const { User} = mongoConfig

function sendError(res, err) {
  return res.send({
    success: false,
    message: err.toString(),
  })
}

router.post('/getSearchUser', async (req, res) => {
  var { searchUserName, userToken } = req.body
  try {
    // user ID of the user who is viewing the profile
    var payload = await jwt.verify(userToken, secret)
  } catch(e) {
    return sendError(res, new Error("Your session has expired. Please refresh and login again."))
  }

  try {
    var { settings, firstName, lastName, friends } = await User.findOne({username: searchUserName}, 'settings firstName lastName friends')
    var isFriend = false
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].id === payload._id) {
        isFriend = true
        break
      }
    }
  } catch(e) {
    console.error(e)
    return sendError(res, e)
  }
  return res.send({
    success: true,
    settings,
    firstName,
    lastName,
    isFriend
  })
})

router.post('/getSearchUserBasicInfo', async (req, res) => {
  var { username } = req.body
  try {
    var { bio, weight, height, age, gender } = await User.findOne({username: username}, 'bio weight height age gender')
    return res.send({
      success: true,
      bio, weight, height, age, gender
    })
  } catch(e) {
    console.error(e)
    return sendError(res, e)
  }
})

router.post('/getSearchUserFitness', async (req, res) => {
  var { username } = req.body
  try {
    var { bests, totals} = await User.findOne({username: username}, 'bests totals')
    return res.send({
      success: true,
      bests, totals
    })
  } catch(e) {
    console.error(e)
    return sendError(res, e)
  }
})

router.post('/getSearchUserFriends', async (req, res) => {
  var { username } = req.body
  try {
    var { friends } = await User.findOne({username: username}, 'friends')
    return res.send({
      success: true,
      friends
    })
  } catch(e) {
    console.error(e)
    return sendError(res, e)
  }
})

module.exports = router