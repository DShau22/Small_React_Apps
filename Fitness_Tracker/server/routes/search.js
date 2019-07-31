// express router imports
const express = require('express')
const router = express.Router()

// imports for mongo
const mongoConfig = require("../database/MongoConfig")
const {User, UserSession} = mongoConfig
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const secret = 'secretkey'

router.post("/searchUser", (req, res) => {
  var { searchText, userToken } = req.body

  jwt.verify(userToken, secret, (err, decoded) => {
    if (err) {
      throw err
      return res.send({
        success: false,
        message: err.toString()
      })
    }

    // perform text search on user first and last name
    // only return users that are registered, not equal to itself
    User.find(
      {"$text": {"$search": searchText}},
      {"score": { "$meta": "textScore"}},
    )
      .limit(10)
      .where('_id').ne(decoded._id)
      .where('registered').equals(true)
      .select({"firstName": 1, "lastName": 1, "_id": 1, "username": 1})
      .sort({"score": {"$meta": "textScore"}})
      .exec((err, users) => {
        if (err) {throw err}
        resBody = {
          users,
        }
        return res.send(resBody)
      })
  })
})

module.exports = router
