const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

router.get('/users', (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      return res.status(200).json({
          users: users,
        })
    })
})

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(409).json({
          message: 'User already exist'
        })
      } else {
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        user
            .save()
            .then((result) => {
                console.log(result)
                res.status(201).json({
                    message: 'Successfully created user.'
                })
            })
            .catch((err) => {
                return res.status(500).json({
                    error: err
                })
            })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err
      })
    })
})
router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      return res.status(200).json({
        message: 'User has been deleted'
      })
    })
    .catch((err) => {
      return res.status(500).json({
        error: err
      })
    })
})

module.exports = router

// openssl rand -base64 64 Hello
