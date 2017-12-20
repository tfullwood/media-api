require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const bodyParser = require('body-parser')

//Local Imports
var routes = require('./server/routes/index')

//mongoose connect
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
})
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch((e) => {
    //throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`)
    console.log(e)
  })

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Use the imported routes
app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

//export module for tests
module.exports = {
  app
}
