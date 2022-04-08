const mongoose = require('mongoose')

const branchSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: [true, 'Branch already exist.'],
    minlength: [3, 'Branch name should be minimum 3 character.']
  }
})

module.exports = mongoose.model('Branch', branchSchema)
