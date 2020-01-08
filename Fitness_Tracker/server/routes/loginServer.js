
  // MAKE NOTE TO MAYBE SCRAP ASYNC JS LIBRARY CODE LATER
  // LOOKS UGLY AF TO MAINTAIN

const mongoConfig = require('../database/MongoConfig');
const { User } = mongoConfig
const express = require('express')
const router = express.Router()
const date = new Date()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = 'secretkey'
const expiresIn = "12h"

const dotenv = require('dotenv')
dotenv.config()

const nodemailer = require("nodemailer");
const async = require("async")

// returns the hashed output given a password input with bcrypt
function hashPass(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

function sendErr(res, err) {
  return res.send({
    success: false,
    message: err.toString()
  })
}

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// called as middleware before jwt verifies the token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next()
  } else {
    // token is invalid or expired
    return res.send({
      success: false,
      message: 'Error: Token is either expired or invalid. Please sign in again.'
    })
  }
}

router.post('/api/account/signup', function(req, res, next) {
  const { body } = req
  const { password, passwordConf } = body
  let { email, firstName, lastName, username } = body
  let failResBody = { success: false, messages: {} }
  // user entered a blank field
  if (!email || !password || !firstName || !lastName || !productCode) {
    return sendErr(res, new Error("Error: Please fill out all fields"))
  }
  if (password !== passwordConf) {
    return sendErr(res, new Error("Error: Passwords must match"))
  }
  // clean all inputs
  email = email.toLowerCase()
  email = email.trim()
  firstName = firstName.toLowerCase()
  firstName = firstName.trim()
  lastName = lastName.toLowerCase()
  lastName = lastName.trim()
  username = username.trim()

  // Steps:
  // 1. Verify email and username don't exist
  // 2. Save
  // 3. Generate token for email
  // 4. Send confirmation email

  // initialize new user to add
  var newUser;

  // MAKE NOTE TO MAYBE SCRAP ASYNC JS CODE LATER
  // LOOKS UGLY AF TO MAINTAIN

  var waterfallCb = (err, results) => {
    if (err) {
      // any errors in the above functions will skip the next functions and go here
      console.log("ERROR: ", err)
      return sendErr(err, res)
    } else {
      console.log("no errors", results)
      return res.send({
        success: true,
        messages: {
          success: `Successfully signed up! Please check your inbox at ${email} for a confirmation email.`
        }
      })
    }
  }

  var parallelCb = (err, results) => {
    if (err) {
      return sendErr(res, err)
    }
    newUser = results[0]
    console.log("parallel finished running: ", newUser)

    async.waterfall([
      // 2.
      // first save the user in the database
      function(callback) {
        console.log("saving user")
        newUser.save(function(err, data) {
          if (err) {
            callback(err)
          } else {
            callback(null)
          }
        })
      },
      // 3. generate token for email
      // generate token for verification email
      function(callback) {
        console.log("signing token")
        // return a signed jwt token using the prod code unique to the user prod
        jwt.sign({productCode}, secret, {expiresIn: expiresIn}, function(err, token) {
          if (err) {
            callback(err)
          } else {
            callback(null, token)
          }
        })
      },
      // 4. send email
      // send the confirmation email
      function(emailToken, callback) {
        var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: "blueshushi.shau@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
              }
        })
        const confRedirect = `http://localhost:3000/confirmation?token=${emailToken}`
        var mailOptions = {
          from: "Test",
          to: "davidshau22@berkeley.edu",
          subject: "nodemailer sending",
          html: `Please click this link to finish your registration:
          <a href=${confRedirect}>clickMe</a>`
        }
        //callback should contain err, result
        console.log("sending email...")
        transporter.sendMail(mailOptions, function(err, data) {
          console.log("sent email")
          if (err) {
            callback(err)
          } else {
            callback(null, data)
          }
        })
      },
    ], waterfallCb)
  }

  // 1. Verify email and username don't exist
  async.parallel([
    // check if email already exists
    function(callback) {
      console.log("parallel starting...")
      User.findOne({email: email}, (err, user) => {
        if (user) {
          var emailExistsError = new Error("email already exists")
          callback(emailExistsError)
        } else if (err) {
          callback(err)
        } else {
          // hash the user's password before putting it in database
          let hash = hashPass(password)

          // create a new document
          var userToSave = new User({
            email,
            password: hash,
            firstName,
            lastName,
            username,
            productCode,
          })
          callback(null, userToSave)
        }
      })
    },
    // check if username already exists
    function(callback) {
      console.log("second function")
      User.findOne({username: username}, (err, user) => {
        if (user) {
          var usernameExistsError = new Error("username already exists")
          callback(usernameExistsError)
        } else if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    },
    // check if product already registered
    function(callback) {
      console.log("third function")
      User.findOne({productCode: productCode}, (err, user) => {
        if (user) {
          var productCodeExistsError = new Error("This Amphibian has already been registered")
          callback(productCodeExistsError)
        } else if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  ], parallelCb)
})

router.post('/api/account/signin', (req, res, next) => {
  const { body } = req;
  //get body content
  const { password } = body;
  let { email } = body;

  // make sure email, password aren't empty
  let failResBody = { success: false, messages: {} }
  // user entered a blank email
  if (!email) {
    failResBody.messages.email = 'Error: Email cannot be blank.'
  }
  if (!password) {
    failResBody.messages.password = 'Error: Password cannot be blank.'
  }
  if (!email || !password) {
    return res.send(failResBody)
  }

  email = email.toLowerCase();
  email = email.trim();
  // check that email exists
  User.findOne({email: email})
    .then(function(user) {
      if (user) {
        // wrong password entered
        if (!user.validPassword(password)) {
          failResBody.messages.password = 'Error: Incorrect Password'
          return res.send(failResBody)
        }
        //get the _id from the queried user
        const _id = user._id

        // token expires in 60 days
        var expiration = "60d"
        // return a signed jwt token using the _id unique to the user
        jwt.sign({_id}, secret, {expiresIn: expiration}, (err, token) => {
          if (err) throw err
          return res.send({
            success: true,
            token,
            messages: {}
          })
        })
      } else { // else for if (user)
        // couldn't find email in the database
        failResBody.messages.email = "Error: This email has not been registered yet."
        return res.send(failResBody)
      }
    })
    .catch(function(err){
      if (err) throw err
    })
})

router.get('/api/account/verify', verifyToken, (req, res, next) => {
  console.log("verifying...")

  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      // token probably isn't verified
      console.log(err)
      res.json({
        success: false,
        message: err.toString(),
      })
    } else {
      res.json({
        success: true,
        message: 'token was successfully verified!',
        token: authData,
      })
    }
  })
})

module.exports = router;
