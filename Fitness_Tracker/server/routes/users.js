// express router imports
const extractToken = require("./extract.js")
const express = require('express')
const router = express.Router()


// imports for mongo
const mongoConfig = require("../database/MongoConfig")
const { User, Jump, Run, Swim } = mongoConfig
const mongoose = require('mongoose')

// other modules and constants
const async = require("async")
const jwt = require("jsonwebtoken")
const secret = 'secretkey'

function sendError(res, err) {
  return res.send({
    success: false,
    message: err.toString(),
  })
}

router.get("/getUserInfo", extractToken, (req, res, next) => {
  //verify token
  var userID;
  jwt.verify(req.token, secret, (err, decoded) => {
    if (err) {
      throw err
      sendError(res, err)
    }
    userID = decoded
    // query for the user's firstname, lastname, friends, and friend requests
    User.findOne(
      {"_id": userID},
      "firstName lastName username friends friendRequests",
    )
    .exec((err, results) => {
      if (err) {
        throw err
        sendError(res, err)
      }
      var { firstName, lastName, username, friends, friendRequests } = results
      return res.send({
        success: true,
        message: "got request",
        firstName,
        lastName,
        username,
        friends,
        friendRequests
      })
    })
  })
})

router.get("/tokenToID", extractToken, (req, res, next) => {
  jwt.verify(req.token, secret, (err, decoded) => {
    if (err) {
      throw err
      sendError(res, err)
    } else {
      return res.send({
        success: true,
        userID: decoded._id
      })
    }
  })
})

// router.get("/getFriendReqs", extractToken, (req, res) => {
//   // verify user's id token
//   jwt.verify(req.token, secret, (err, userID) => {
//     if (err) {
//       throw err
//       sendError(res, err)
//     }
//     User.findOne({"_id": userID}, "friendRequests", (err, results) => {
//       if (err) {
//         throw err
//         sendError(res, err)
//       }
//       var { friendRequests } = results
//       return res.send({
//         success: true,
//         friendRequests
//       })
//     })
//   })
// })

router.post("/acceptRequest", (req, res) => {
  // 1. verify user token
  // 2. update user's friends (add sender), friendRequest fields (remove sender)
  // 3. update sender's friends (add user), friendsPending field (remove user)
  // 4. send success response
  // steps 2 and 3 should be done in parallel
  var {
    userToken,
    userFirstName,
    userLastName,
    senderID,
    senderFirstName,
    senderLastName,
  } = req.body

  // 1.
  var userID;
  jwt.verify(userToken, secret, (err, decoded) => {
    if (err) {
      throw err
      sendError(res, err)
    }
    userID = decoded._id
  })

  // callback for async parallel
  var cb = (err, results) => {
    if (err) {
      sendError(res, err)
    } else {
      res.send({
        success: true,
        message: `successfully added ${senderFirstName + " " + senderLastName} as a friend!`
      })
    }

  }

  // define friend objects
  var senderFriend = {
    id: senderID,
    firstName: senderFirstName,
    lastName: senderLastName
  }
  var userFriend = {
    id: userID,
    firstName: userFirstName,
    lastName: userLastName,
  }

  // 2. and 3.
  async.parallel([
    // 2. add sender to user's friends list, remove sender from friend requests
    function(callback) {
      User.findOneAndUpdate(
        { '_id': userID},
        {
          "$pull": { "friendRequests": { "senderID": senderID } },
          "$push": { "friends": senderFriend }
        }
      )
      .exec((err, results) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    //3. add user to sender's friends array, remove user from sender's pending array
    function(callback) {
      console.log("userID is: ", userID)
      User.findOneAndUpdate(
        { '_id': senderID},
        {
          "$pull": { "friendsPending": { "receiverID": userID } },
          "$push": { "friends": userFriend }
        }
      )
      .exec((err, results) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  ], cb)
})

router.post("/sendFriendReq", (req, res) => {
  // extract the friend's id that the user is sending a request to
  // also extract the token that is saved in local storage
  var { friend_id, token, friendFirstName, friendLastName, userFirstName, userLastName } = req.body
  // define a callback for async parallel
  var cb = (err, results) => {
    if (err) {
      sendError(res, err)
    } else {
      res.send({
        success: true
      })
    }
  }

  // verify user token and save the decoded _id
  var user_id;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      sendError(res, err)
    } else {
      user_id = decoded._id
    }
  })

  // update user's friends pending array, and the receiver's
  // friend requests array
  async.parallel([
    // update receiver's requests array
    function(callback) {
      var friendRequest = {
        senderID: user_id,
        senderFirstName: userFirstName,
        senderLastName: userLastName
      }
      User.findOneAndUpdate(
        { '_id': friend_id},
        { "$push": { "friendRequests": friendRequest } }
      )
      .exec((err, results) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    // update sender's pending array
    function(callback) {
      var pendingJson = {
        receiverID: friend_id,
        receiverFirstName: friendFirstName,
        receiverLastName: friendLastName,
      }
      User.findOneAndUpdate(
        { '_id': user_id },
        { "$push": { "friendsPending": pendingJson } }
      )
      .exec((err, results) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  ], cb)
})


module.exports = router
