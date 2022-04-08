const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Your are not authorised to access this API.'
    })
  }

  try {
    const token = req.headers.authorization.split(' ')[1] || null
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })
    req.userData = decoded
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: 'Signature has expired!'
    })
  }
}
