const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: [true, 'Car already exist.'],
    minlength: [3, 'Car name should be minimum 3 character.']
  },
  modelNo: {
    type: String,
    required: false,
    unique: [false, 'Car already exist.'],
    minlength: [3, 'Car name should be minimum 3 character.']
  },
  city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

module.exports = mongoose.model('Car', carSchema)
