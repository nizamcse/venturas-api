const Car = require('../models/car')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const getAllCars = (q, s, l) => {
  return Car.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: '_id',
        as: 'city'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind : "$city" },
    { $unwind : "$user" },
    { $skip: s },
    { $limit: l }
  ])
}

const getOperatorCars = (id) => {
  return Car.aggregate([
    {$match: { "user": ObjectId(id) } },
     {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: '_id',
        as: 'city'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind : "$city" },
    { $unwind : "$user" },
  ]);
}
const getTotalMatch = (q) => {
  return Car.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $count: 'total' }
  ])
}

const matchedRecords = (q) => {
  return Car.aggregate([{ $match: { name: q } }, { $count: 'total' }])
}

const doesItExist = async (req, comparer = 0) => {
  const name = req.body.name
  const total = await matchedRecords(name)
  const { total: count } = total[0] ? total[0] : { total: 0 }
  return count > comparer
}

const storeCar = (data) => {
  const car = new Car(data)
  return car.save()
}

const createMultiple = async (data) => {
  let bulCar = [];

  data.forEach(function(car) {
    bulCar.push({
      updateOne: {
        filter: { name: car.name },
        update: { $set: { name: car.name } },
        upsert: true
      }
    });
  });
  Car.bulkWrite(bulCar);
  return true;
}

const firstOrCreate = (q) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let allMatches = await Car.aggregate([
          { $match: { name: { $regex: q.name, $options: 'i' } } }
        ])
        if (allMatches.length > 0)
          resolve({ name: allMatches[0].name, _id: allMatches[0]._id })
        else {
          let createdCar = await storeCar(q)
          resolve({ name: createdCar.name, _id: createdCar._id })
        }
      } catch (e) {
        reject(e)
      }
    })()
  })
}

const updateOneCar = (id, data) => {
  return Car.updateOne({ _id: id }, { ...data })
}

const getById = (id) => {
  return Car.findById(id)
}

const deleteCar = (id) => {
  return Car.remove({ _id: id })
}

const findById = (id) => {
  return Car.findById(id)
}

module.exports = {
  getTotalMatch,
  getAllCars,
  storeCar,
  findById,
  doesItExist,
  updateOneCar,
  getById,
  deleteCar,
  createMultiple,
  getOperatorCars
}
