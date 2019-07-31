// express router imports
const extractToken = require("./extract.js")
const express = require('express')
const router = express.Router()

// for profile picture uploads. Cloudinary stuff with multer for body parsing
const dotenv = require('dotenv')
const multer = require("multer")
const cloudinary = require("cloudinary")
const cloudinaryStorage = require("multer-storage-cloudinary")
const md5File = require("md5-file")
var formidable = require('formidable')

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

// configurations for cloudinary
dotenv.config()
cloudinary.config(
  {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
)

const storage = cloudinaryStorage(
  {
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    // transformation: [{ width: 500, height: 500, crop: "limit" }]
  }
)

const multerParser = multer({ storage: storage });

// gets all the user info that is stored in the document in mongo
router.get("/getUserInfo", extractToken, (req, res, next) => {
  const projection = { _id: 0, __v: 0, password: 0, productCode: 0, registered: 0, registerDate: 0 }
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
      projection,
    )
    .exec((err, results) => {
      if (err) {
        throw err
        sendError(res, err)
      }
      return res.send({
        success: true,
        message: "got request",
        ...results._doc
      })
    })
  })
})

router.post("/checkDuplicatePic", (req, res) => {
  var form = new formidable()
  form.hash = "md5"
  // fields will contain the picFile, and the current pic hash
  form.parse(req, function(err, fields, files) {
    // get user profile pic info from database
    var { profilePic } = files
    var { currImgHash } = fields
    console.log(profilePic.hash, currImgHash)
    if (profilePic.hash === currImgHash) {
      return sendError(res, new Error("please upload a profile picture that is different from your current photo"))
    } else {
      return res.send({
        success: true,
      })
    }
  })
})

router.post("/uploadProfilePic", multerParser.single("profilePic"), extractToken, (req, res) => {
  // decode user token
  var userID;
  jwt.verify(req.token, secret, (err, decoded) => {
    if (err) { return sendError(res, err) }
    userID = decoded._id
  })

  // update the database with new url and etag
  console.log(req.file)
  var { file } = req
  var { url, secure_url, etag } = file
  profileURL = secure_url
  MD5signature = etag
  User.findOneAndUpdate(
    {"_id": userID},
    {profilePicture: { "profileURL": profileURL, "etag": MD5signature }},
  ).exec((err, results) => {
    if (err) {
      return sendError(res, err)
    } else {
      return res.send({
        success: true
      })
    }
  })
})

router.post("/updateProfile", (req, res) => {
  var { userToken, firstName, lastName, bio, gender, height, weight, location } = req.body

  // decode user token
  var userID;
  jwt.verify(userToken, secret, (err, decoded) => {
    if (err) {
      return sendError(res, err)
    }
    userID = decoded._id
  })

  // update database with new profile changes
  User.findOneAndUpdate(
    {"_id": userID},
    {
      firstName,
      lastName,
      bio,
      gender,
      height,
      weight,
      location,
    }
  ).exec((err, results) => {
    if (err) {
      return sendError(res, err)
    } else {
      res.send({ success: true })
    }
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

router.post("/acceptRequest", (req, res) => {
  // 1. verify user token
  // 2. update user's friends (add sender), friendRequest fields (remove sender)
  // 3. update sender's friends (add user), friendsPending field (remove user)
  // 4. send success response
  // steps 2 and 3 should be done in parallel
  var {
    userToken,
    receiverFirstName,
    receiverLastName,
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
    lastName: senderLastName,
  }
  var userFriend = {
    id: userID,
    firstName: receiverFirstName,
    lastName: receiverLastName,
  }

  // 2. and 3.
  async.parallel([
    // 2. add sender to user's friends list, remove sender from friend requests
    function(callback) {
      User.findOneAndUpdate(
        { '_id': userID},
        {
          "$pull": { "friendRequests": { "id": senderID } },
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
          "$pull": { "friendsPending": { "id": userID } },
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
  var { friend_id, token, senderFirstName, senderLastName, senderUsername, receiverFirstName, receiverLastName, receiverUsername } = req.body
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
        id: user_id,
        firstName: senderFirstName,
        lastName: senderLastName,
        username: senderUsername
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
        id: friend_id,
        firstName: receiverFirstName,
        lastName: receiverLastName,
        username: receiverUsername,
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
