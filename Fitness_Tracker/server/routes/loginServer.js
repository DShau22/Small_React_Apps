const mongoConfig = require('../database/MongoConfig');
const {User, UserSession} = mongoConfig
const express = require('express')
const router = express.Router()
const date = new Date()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function hashPass(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

router.post('/api/account/signup', function(req, res, next) {
  const { body } = req
  const { password, firstName, lastName, productCode } = body
  let { email } = body

  // user entered a blank email
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    })
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    })
  }
  email = email.toLowerCase()
  email = email.trim()

  // Steps:
  // 1. Verify email doesn't exist
  // 2. Save
  User.findOne({email: email})
    .then(function(user) {
      if (user) {
        return res.send({
          success: false,
          message: 'Error: Email already registered. Please use a different email.'
        })
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
  const { password } = body;
  let { email } = body;

  // make sure email, password aren't empty
  if (!email) {
    return res.send({
      success: false,
      message: 'Error: Email cannot be blank.'
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: 'Error: Password cannot be blank.'
    });
  }

  email = email.toLowerCase();
  email = email.trim();
  // check that email exists
  User.findOne({email: email})
    .then(function(user) {
      if (user) {
        // wrong password entered
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: 'Error: Invalid Password'
          })
        }

        // gets the current time for the registration date
        var todayMil = date.getTime()
        var today = new Date(todayMil)

        // create a new session document
        const userSession = new UserSession({
          email,
          timestamp: today,
        })

        userSession.save((err, doc) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: 'Error: server error'
            });
          }
          // send the token (email for now) back
          return res.send({
            success: true,
            message: 'Valid sign in',
            token: doc._id
          })
        })
      } else {
        // couldn't find email in the database
        return res.send({
          success: false,
          message: 'This email has not been registered yet.'
        })
      }
    })
    .catch(function(err){
      if (err) throw err
    })
})

router.get('/api/account/logout', function(req, res, next) {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.findOneAndUpdate({
    _id: token,
    isDeleted: false
  }, {
    $set: {
      isDeleted:true
    }
  }, null, function(err, sessions) {
    if (err) throw err
    return res.send({
      success: true,
      message: 'successfully logged out!'
    });
  });
})

router.get('/api/account/verify', function(req, res, next) {
  console.log("verifying...")
  console.log("token is: ", req.query.token)
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test
  // Verify the token is one of a kind and it's not deleted.
  UserSession.find({
    _id: token,
    isDeleted: false
  }, (err, sessions) => {
    if (err) {
      console.log(err);
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (sessions.length != 1) {
      return res.send({
        success: false,
        message: 'Error: Invalid'
      });
    } else {
      // DO ACTION
      return res.send({
        success: true,
        message: 'Good'
      });
    }
  });
})

module.exports = router;
