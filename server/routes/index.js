const express = require('express')

//import routes
var mediaRoutes = require('./media')
//var tagRoutes = require('./tags')

var router = express.Router()

//mount routes
router.use('/media', mediaRoutes)

//Havent created the tags yet
  //Not sure if I'll use them at any point
//router.use('/tags', tagRoutes)

module.exports = router
