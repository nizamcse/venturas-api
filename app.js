// aZNCEhTrFAw5OGcp
const express = require('express')
const app = express()
const cors = require("cors")
const auth = require('./api/middleware/auth')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const userRoutes = require('./api/routes/user')
const loginRoute = require('./api/routes/login')
const branchRoute = require('./api/routes/branch')
const cityRoute = require('./api/routes/cities')
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})
app.set('env', 'production')
app.use('/api', loginRoute)
app.use('/api/user',auth, userRoutes)
app.use('/api/branches',auth, branchRoute)
app.use('/api/cities', cityRoute)


app.use((req, resp, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error, req, resp, next) => {
  resp.status(error.status || 500)
  resp.json({
    error: {
      message: error.message
    }
  })
})
module.exports = app





