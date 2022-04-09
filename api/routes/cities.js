const express = require('express')

const router = express.Router()
const {
  index,
  store,
  updateOne,
  deleteOne,
  findOne,
  uploadCities
} = require('../controllers/city-controller')

router.get('/', index)

router.post('/', store)

router.post('/upload',uploadCities)

router.get('/:id', findOne)

router.patch('/:id', updateOne)

router.delete('/:id', deleteOne)

module.exports = router
