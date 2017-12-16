const express = require('express')

//import routes
var mediaRoutes = require('./media')

var router = express.Router()

//mount routes
router.use('/media', mediaRoutes)

module.exports = router
