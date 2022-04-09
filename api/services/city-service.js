const City = require('../models/city')

const getAllCities = (q, s, l) => {
  return City.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $skip: s },
    { $limit: l }
  ])
}
const getTotalMatch = (q) => {
  return City.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $count: 'total' }
  ])
}

const matchedRecords = (q) => {
  return City.aggregate([{ $match: { name: q } }, { $count: 'total' }])
}

const doesItExist = async (req, comparer = 0) => {
  const name = req.body.name
  const total = await matchedRecords(name)
  const { total: count } = total[0] ? total[0] : { total: 0 }
  return count > comparer
}

const storeCity = (data) => {
  const city = new City(data)
  return city.save()
}

const firstOrCreate = (q) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let allMatches = await City.aggregate([
          { $match: { name: { $regex: q.name, $options: 'i' } } }
        ])
        if (allMatches.length > 0)
          resolve({ name: allMatches[0].name, _id: allMatches[0]._id })
        else {
          let createdCity = await storeCity(q)
          resolve({ name: createdCity.name, _id: createdCity._id })
        }
      } catch (e) {
        reject(e)
      }
    })()
  })
}

const updateOneCity = (id, data) => {
  return City.updateOne({ _id: id }, { ...data })
}

const getById = (id) => {
  return City.findById(id)
}

const deleteCity = (id) => {
  return City.remove({ _id: id })
}

const findById = (id) => {
  return City.findById(id)
}

module.exports = {
  getTotalMatch,
  getAllCities,
  storeCity,
  findById,
  doesItExist,
  updateOneCity,
  getById,
  deleteCity
}
