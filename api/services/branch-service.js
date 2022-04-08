const Branch = require('../models/branch')

const getAllBranches = (q, s, l) => {
  return Branch.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $skip: s },
    { $limit: l }
  ])
}
const getTotalMatch = (q) => {
  return Branch.aggregate([
    { $match: { name: { $regex: q, $options: 'i' } } },
    { $count: 'total' }
  ])
}

const matchedRecords = (q) => {
  return Branch.aggregate([{ $match: { name: q } }, { $count: 'total' }])
}

const doesItExist = async (req, comparer = 0) => {
  const name = req.body.name
  const total = await matchedRecords(name)
  const { total: count } = total[0] ? total[0] : { total: 0 }
  return count > comparer
}

const storeBranch = (data) => {
  const branch = new Branch(data)
  return branch.save()
}

const firstOrCreate = (q) => {
  return new Promise((resolve, reject) => {
    ;(async () => {
      try {
        let allMatches = await Branch.aggregate([
          { $match: { name: { $regex: q.name, $options: 'i' } } }
        ])
        if (allMatches.length > 0)
          resolve({ name: allMatches[0].name, _id: allMatches[0]._id })
        else {
          let createdBranch = await storeBranch(q)
          resolve({ name: createdBranch.name, _id: createdBranch._id })
        }
      } catch (e) {
        reject(e)
      }
    })()
  })
}

const updateOneBranch = (id, data) => {
  return Branch.updateOne({ _id: id }, { ...data })
}

const getById = (id) => {
  return Branch.findById(id)
}

const deleteBranch = (id) => {
  return Branch.remove({ _id: id })
}

const findById = (id) => {
  return Branch.findById(id)
}

module.exports = {
  getTotalMatch,
  getAllBranches,
  storeBranch,
  findById,
  doesItExist,
  updateOneBranch,
  getById,
  deleteBranch
}
