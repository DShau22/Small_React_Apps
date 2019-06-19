const mongoConfig = require('../database/MongoConfig');
const {User, UserSession} = mongoConfig
const express = require('express')
const router = express.Router()
const date = new Date()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = 'secretkey'
const expiresIn = "12h"
// returns the hashed output given a password input with bcrypt
function hashPass(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
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
  const { password, firstName, lastName, productCode } = body
  let { email } = body
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

  email = email.toLowerCase()
  email = email.trim()

  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  User.findOne({email: email})
    .then(function(user) {
      if (user) {
        failResBody.messages.email = 'Error: Email already registered. Please use a different email.'
        return res.send(failResBody)
      } else {

        // gets the current time for the registration date
        var todayMil = date.getTime()
        var today = new Date(todayMil)

        // hash the user's password before putting it in database
        let hash = hashPass(password)

        // create a new document
        const newUser = new User({
          email,
          password: hash,
          firstName,
          lastName,
          productCode,
          registerDate: today,
        })

        // save the new user in mongo
        newUser.save()
          .then(function(user) {
            return res.send({
              success: true,
              message: 'Successfully signed up!'
            })
          })
          .catch(function(err) {
            if (err) throw err
          })
      }
    })
    .catch(function(err) {
      if (err) throw err
    })
})

router.post('/api/account/signin', function(req, res, next) {
  const { body } = req;
  //get body content
  const { password, remember } = body;
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

        // checks if user asked to be remembered on signins
        if (remember) {
          //get the _id from the queried user
          const _id = user._id

          // return a signed jwt token using the _id unique to the user
          jwt.sign({_id}, secret, (err, token) => {
            return res.send({
              success: true,
              token,
            })
          })
        }
      } else {
        // couldn't find email in the database
        failResBody.messages.email = "Error: This email has not been registered yet."
        return res.send(failResBody)
      }
    })
    .catch(function(err){
      if (err) throw err
    })
})

router.get('/api/account/logout', verifyToken, function(req, res, next) {
  console.log("verifying...")
  jwt.verify(req.token, secret, (err, authData) => {
    if(err) {
      throw err
    } else {
      res.json({
        success: true,
        message: 'successfully logged out!',
        token: authData,
      })
    }
  })
})

router.get('/api/account/verify', verifyToken, function(req, res, next) {
  console.log("verifying...")

  jwt.verify(req.token, secret, (err, authData) => {
    if (err) {
      console.log(err)
      res.json({
        success: false,
        message: err,
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
