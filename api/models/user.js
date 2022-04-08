const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

userSchema.pre("save",function(next){
    var user = this
    if(this.isModified("password") || this.isNew){
        bcrypt.genSalt(saltRounds, function (err, hash) {
          if (err) {
            return next(err)
          }
          bcrypt.hash(user.password,saltRounds,function(err,hash){
              if(err) return next(err)
              user.password = hash
              next()
          })
        })
    }
    else{
        return next()
    }
});

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if(err) {
          console.log("Does Not Matched pasword",err)
            return cb(err)
        }
        console.log("Matched pasword")
        cb(null, isMatch)
    })
}

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  return obj
}
module.exports = mongoose.model('User', userSchema)
