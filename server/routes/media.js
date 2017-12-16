const express = require('express')

//import locals
var mediaCtrl = require('../controllers/media')
var { Media } = require('../models/media')

const router = express.Router()

router.get('/:id', mediaCtrl.getMedia)

router.get('/', mediaCtrl.getMedias)





router.post('/', (req, res) => {
  //res.send('media post')

  var media = new Media({
    title: req.body.title,
    _parent: req.body.parent,
    seriesOrder: req.body.seriesOrder,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    location: req.body.location
  })

  media.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).json({error: e})
  })
})

router.put('/:id', (req, res) => {
  res.send('media updated')
})

router.delete('/:id', (req, res) => {
  res.send(`Delete media: ${req.params.id}`)
})

module.exports = router



//some sample routes with controller data included
// router.get('/:id', (req, res) => {
//   mediaCtrl.getMedia
//
//   //res.send(`Get Media ${req.params.id}`)
//
//   ////////////////////////////// MOVE THIS TO THE CONTROLLER //////////////////////////////
//   // Media.get(req.params.id)
//   //   .then(media => {
//   //     res.send(media)
//   //   })
//   //   .catch((e) => {
//   //     res.json({
//   //       error: e
//   //     })
//   //   })
//     ////////////////////////////// MOVE THIS TO THE CONTROLLER //////////////////////////////
//
// })
