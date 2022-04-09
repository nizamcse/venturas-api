const mongoose = require('mongoose')
const multer  = require('multer')
const xlsx = require('xlsx')
var fs = require('fs')
const upload = multer({
    storage: multer.memoryStorage(),
    limit: 5*1024*1024,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(csv|xls|xlsx)$/)) { 
           return cb(new Error('Please upload a CSV/Excel file.'))
         }
       cb(undefined, true)
    }
}).single('csvFile')
const {
  getAllCities,
  getTotalMatch,
  storeCity,
  findById,
  doesItExist,
  updateOneCity,
  deleteCity
} = require('../services/city-service')


const index = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    const skip = parseInt(req.query.offset) || 0
    const query = req.query.search || ''
    const totalMatch = await getTotalMatch(query)
    const branches = await getAllCities(query, skip, limit)
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
    name: req.body.name
  }
  try {
    const doesCityExist = await doesItExist(req)
    if (doesCityExist) {
      return res.status(409).json({
        message: 'City already exist'
      })
    }
    const branch = await storeCity(data)
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
    name: req.body.name
  }
  const id = req.params.id

  try {
    const doesCityExist = await doesItExist(req, 1)
    if (doesCityExist) {
      return res.status(409).json({
        message: 'City already exist'
      })
    }
    const b = await updateOneCity(id, data)
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
    const result = await deleteCity(id)
    if (result.deletedCount === 0)
      return res.status(200).json({
        message: 'Record could not found.',
        results: result
      })
    return res.status(200).json({
      message: 'City deleted successfully',
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

const uploadCities = async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(409).send({message: err});
    } else if (err) {
      res.status(409).send({message: "Unknown error."});
    }
    try{
        const file = xlsx.read(req.file.buffer,{type: "buffer"});
        const sheetNames = file.SheetNames;
        const totalSheets = sheetNames.length;
        let parsedData = [];
        for (let i = 0; i < totalSheets; i++) {
            // Convert to json using xlsx
            const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
            // Skip header row which is the colum names
            tempData.shift();
            // Add the sheet's json to our data array
            parsedData.push(...tempData);
        }
    }catch(err){
        res.status(409).send({message: "Could not read data from uploaded file."});
    }
    res.status(200).send({message: "File uploaded",parsedData})
  });
}

module.exports = { index, store, updateOne, deleteOne, findOne,uploadCities }
