const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')

router.get('/', (req, res, next) => {
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
        let password = req.body.password || Math.floor(100000 + Math.random() * 900000);
        const user = new User({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: password,
            userType: req.body.userType
        })
        user
            .save()
            .then((result) => {
                res.status(201).json({
                    message: 'Successfully created user.',
                    user: result,
                    password
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

router.patch('/update/:id', async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType
  }
  const id = req.params.id
  try{
    await User.updateOne({ _id: id }, { ...data })
    return res.status(200).json({
      message: 'Successfully updated user',
    })
  }catch(error){
    console.log(error)
    return res.status(409).json({
      error: 'Could not update user.',
    })
  }
})

router.delete('/:userId', async (req, res, next) => {
  const id = req.params.id
  try {
    const result = await User.deleteOne(id)
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      })
    return res.status(200).json({
      message: 'User deleted successfully',
      results: result
    })
  } catch (e) {
    return res.status(500).json({
      message: e.message
    })
  }
})

module.exports = router

// openssl rand -base64 64 Hello
