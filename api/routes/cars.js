const express = require('express')

const router = express.Router()
const {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  uploadCities
} = require('../controllers/car-controller')

router.get('/', index)

router.post('/', store)

router.get('/:id', findOne)

router.patch('/:id', updateOne)

router.delete('/:id', deleteOne)

module.exports = router
