const mongoose = require('mongoose')
const {
  getAllCars,
  getTotalMatch,
  storeCar,
  findById,
  doesItExist,
  updateOneCar,
  deleteCar,
  getOperatorCars
} = require('../services/car-services')


const index = async (req, res) => {
  try {
    if(req.userData.userType === 'OPERATOR'){
      const cars = await getOperatorCars(req.userData._id)
      return res.status(200).json({
        results: cars,
      })
    }
    const limit = parseInt(req.query.limit) || 100
    const skip = parseInt(req.query.offset) || 0
    const query = req.query.search || ''
    const totalMatch = await getTotalMatch(query)
    const branches = await getAllCars(query, skip, limit)
    return res.status(200).json({
      results: branches,
      total: totalMatch[0] && totalMatch[0].total ? totalMatch[0].total : 0
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}

const store = async (req, res) => {
  const data = {
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    modelNo: req.body.modelNo,
    user: req.body.user,
    city: req.body.city
  }
  try {
    const doescarExist = await doesItExist(req)
    if (doescarExist) {
      return res.status(409).json({
        message: 'car already exist'
      })
    }
    const branch = await storeCar(data)
    return res.status(200).json({
      results: branch,
      message: 'Successfully created branch'
    })
  } catch (e) {
    if (e.message.indexOf('duplicate key error') !== -1)
      return res.status(409).json({
        message: 'Validation failed.',
        errors: [{ name: `"${data.name}" Already exist.` }]
      })
    let errors = []
    if (e.errors) {
      let keys = Object.keys(e.errors || {})
      for (let key of keys) {
        errors.push({ [key]: e.errors[key].message })
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: 'Validation failed.',
        errors: errors
      })

    return res.status(500).json({
      message: e.message
    })
  }
}

const updateOne = async (req, res) => {
  const data = {
    name: req.body.name,
    modelNo: req.body.modelNo,
    user: req.body.user,
    city: req.body.city
  }
  const id = req.params.id

  try {

    const b = await updateOneCar(id, data)
    const branch = await findById(id)
    return res.status(200).json({
      results: branch,
      message: 'Successfully updated branch',
    })
  } catch (e) {
    if (e.message.indexOf('duplicate key error') !== -1)
      return res.status(409).json({
        message: 'Validation failed.',
        errors: [{ name: `"${data.name}" Already exist.` }]
      })
    let errors = []
    if (e.errors) {
      let keys = Object.keys(e.errors || {})
      for (let key of keys) {
        errors.push({ [key]: e.errors[key].message })
      }
    }
    if (errors.length)
      return res.status(400).json({
        message: 'Validation failed.',
        errors: errors
      })

    return res.status(500).json({
      message: e.message
    })
  }
}

const deleteOne = async (req, res) => {
  const id = req.params.id
  try {
    const result = await deleteCar(id)
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      })
    return res.status(200).json({
      message: 'car deleted successfully',
      results: result
    })
  } catch (e) {
    return res.status(500).json({
      message: e.message
    })
  }
}

const findOne = async (req, res) => {
  const id = req.params.id
  try {
    const branch = await findById(id)
    return res.status(200).json({
      results: branch
    })
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      message: e.message
    })
  }
}


module.exports = { index, store, updateOne, deleteOne, findOne }



/// 869655