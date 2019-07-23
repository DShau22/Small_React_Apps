const queryString = require('query-string')
const fs = require("fs");
const express = require('express')
const extractToken = require("./extract")
const router = express.Router()
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer");

const dotenv = require('dotenv')
dotenv.config()

const mongoConfig = require("../database/MongoConfig")
const { User } = mongoConfig
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const secret = 'secretkey'
const async = require("async")
const date = new Date()
const confRedirectRoute = "http://localhost:3000/confirmation?"

// returns the hashed output given a password input with bcrypt
function hashPass(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

function sendResponse(res, success, msg) {
  console.log("sending response...", success, msg)
  return res.send({
    success: success,
    messages: {
      msg: msg,
    }
  })
}

router.get("/confirmation", (req, res) => {
  var emailToken = req.query.token
  console.log(req.query)

  async.waterfall([
    // veryify the token
    function(callback) {
      jwt.verify(emailToken, secret, (err, decoded) => {
        if (err) {
          callback(err)
        } else {
          callback(null, decoded.productCode)
        }
      })
    },
    //check if user already registered
    function(decoded, callback) {
      console.log("productCode: ", decoded)
      User.findOne({productCode: decoded}, (err, results) => {
        if (results.registered) {
          callback(new Error("This user or Amphibian is already registered"))
        } else {
          callback(null, decoded)
        }
      })
    },
    // register user in database
    function(decoded, callback) {
      // gets the current time for the registration date
      var todayMil = date.getTime()
      var today = new Date(todayMil)
      // find user based on product code, which should be unique...
      User.findOneAndUpdate({productCode: decoded}, {registered: true, registerDate: today}, (err, results) => {
        if (err) {
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  ], function(err, results) {
    if (err) {
      console.log("there was an error :(")
      console.log(err)
      sendResponse(res, false, "Something went wrong with the confirmation process."
                                        + "Contact us for support if needed: " + err.toString())
    } else {
      console.log("redirecting...")
      sendResponse(res, true, "Successfully signed up via email confirmation!")
    }
  })
})

router.post("/forgotPassword", (req, res) => {
  console.log("forgot password")
  // check if email is registered,
  // if it is, send a pw reset email
  var { email } = req.body
  console.log("email: ", email)
  User.findOne({email: email}, (err, user) => {
    if (err) throw err
    if (!user) {
      console.log("not registered")
      // couldn't find a user with this email
      sendResponse(res, false, "This email has not been registered yet.")
    } else if (user && !user.registered) {
      sendResponse(res, false, "This user has registered but has not confirmed. Please check the inbox for a confirmation email.")
    }

    async.waterfall([
      // sign an email token, which is verified on the pwResetPage
      function(callback) {
        jwt.sign({email}, secret, {expiresIn: "12h"}, (err, token) => {
          if (err) {
            callback(err)
          } else {
            callback(null, token)
          }
        })
      },
      // send the email
      function(token, callback) {
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: "blueshushi.shau@gmail.com",
            pass: process.env.EMAIL_PASSWORD
          }
        })
        const confRedirect = `http://localhost:3000/pwResetPage?token=${token}`
        var mailOptions = {
          from: "Test",
          to: "davidshau22@berkeley.edu",
          subject: "nodemailer sending pwReset",
          html: `Please click this link to reset your password:
          <a href=${confRedirect}>Reset Password</a>`
        }
        console.log("sending mail...")
        transporter.sendMail(mailOptions, function(err, data) {
          if (err) {
            callback(err)
          } else {
            callback(null)
          }
        })
      },
    ], function(err, results) {
      if (err) {
        sendResponse(res, false, "something went wrong with the reset process: " + err.toString())
      } else {
        sendResponse(res, true, "password reset email was sent")
      }
    })
  })
})

router.post("/confPasswordReset", (req, res) => {
  var { newPassword, email } = req.body
  console.log("new pass is: ", newPassword)
  var newHashedPass = hashPass(newPassword)
  // check if user exists
  User.findOne({email: email})
    .then((user) => {
      if (!user) {
        // for some reason the database can't find the user
        console.log("email: ", email)
        sendResponse(res, false, "This email is not registered. Contact support for help.")
      }
    })
  .catch((err) => {
    sendResponse(res, false, "Something went wrong with the server. Please try again later.")
  })

  User.findOneAndUpdate({email: email}, {password: newHashedPass}, (err, results) => {
    if (err) {
      sendResponse(res, false, "Something went wrong with the server. Please try again later.")
    }
    sendResponse(res, true, "Successfully updated your password!")
  })
  // update the database with new password
})

module.exports = router