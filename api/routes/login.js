const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
router.post('/login', (req, res, next) => {
  User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) throw err
      if (!user) {
        console.log("user",user)
          res.status(403).send({success: false, msg: 'Authentication Failed, User not found',u: req.body.email})
      }

      else {
          user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                  let token = jwt.sign(
                  {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    userType: user.userType
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: 60 * 60 * 24 * 30 
                  }
                )
                return res.status(200).json({
                  message: 'Login successfull',
                  token: token,
                  user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    userType: user.userType
                  }
                })
              }
              else {
                  return res.status(403).json({success: false, msg: 'Authentication failed, wrong password'})
              }
          })
      }
    }
  )
})

module.exports = router