const _ = require('lodash')
var ObjectId = require('mongoose').Types.ObjectId

const { Media } = require('../models/media')
const { trim } = require('../helpers/helpers')

function getMedia(req, res) {
  //get media by id - call model, and return object from model

  const id = req.params.id

  Media.get(id)
    .then((media) => {
      return res.json(media)
    })
    .catch((e) => {
      res.status(e.status).json({
        error: e.message
      })

      //console.log(e)
      //next(e)
    })

} //end getMedia

function getMedias(req, res) {
  var start = req.query.start || 0
  var limit = req.query.limit || 50
  var search = req.query.search || null

  if (_.isNaN(Number(start)) || _.isNaN(Number(limit))) {
    return res.json({
      error: 'Start and Limit parameters must be a number'
    })
  } else if (Number(limit) > 1000) {
    limit = 1000
  }

  if (req.query.removed == 'true') {
    //included flagged objects
    var removed = true
  } else {
    var removed = false
  }

  Media.list(start, limit, search, removed)
    .then((medias) => {
      return res.json(medias)
    })
    .catch((e) => {
      return res.status(e.status).json({
        error: e.message
      })
    })
} //end getMedias

function createMedia(req, res) {
  //Do Validation
  if (!req.body.title || !req.body.location) {
    return res.status(400).json({
      error: 'Title and Location are required fields'
    })
  } else if (_.trim(req.body.title).length < 2 || _.trim(req.body.location).length < 2) {
    return res.status(400).json({
      error: 'Title and Location must be more than 2 characters'
    })
  } else if (req.body.parent && _.trim(req.body.description).length < 2) {
    return res.status(400).json({
      error: 'Description must be more than 2 characters'
    })
  } else if (req.body.parent && !ObjectId.isValid(req.body.parent)) {
    return res.status(400).json({
      error: 'Invalid Parent ID'
    })
  } else if (req.body.series_order && !Number(req.body.series_order)) {
    return res.status(400).json({
      error: 'Invalid Series Order'
    })
  } else if (req.body.thumbnail && _.trim(req.body.thumbnail).length < 2) {
    return res.status(400).json({
      error: 'Thumbnail must be at least 2 characters.'
    })
  }
  //validation passed - send to db

  //calls the trim helper
    //if undefined it just returns, else use trim whitespace
  var vals = {
    title: trim(req.body.title),
    _parent: req.body.parent,
    seriesOrder: trim(req.body.series_order),
    description: trim(req.body.description),
    thumbnail: trim(req.body.thumbnail),
    location: trim(req.body.location)
  }

  var media = new Media(vals)

  media.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(500).json({error: e})
  })
} //end createMedia

function updateMedia(req, res) {
  Media.findById(req.params.id)
      .then((media) => {
        //validation
        if (!req.body.title || !req.body.location) {
          return res.status(400).json({
            error: 'Title and Location are required fields'
          })
        } else if (_.trim(req.body.title).length < 2 || _.trim(req.body.location).length < 2) {
          return res.status(400).json({
            error: 'Title and Location must be more than 2 characters'
          })
        } else if (req.body.parent && _.trim(req.body.description).length < 2) {
          return res.status(400).json({
            error: 'Description must be more than 2 characters'
          })
        } else if (req.body.parent && !ObjectId.isValid(req.body.parent)) {
          return res.status(400).json({
            error: 'Invalid Parent ID'
          })
        } else if (req.body.series_order && !Number(req.body.series_order)) {
          return res.status(400).json({
            error: 'Invalid Series Order'
          })
        } else if (req.body.thumbnail && _.trim(req.body.thumbnail).length < 2) {
          return res.status(400).json({
            error: 'Thumbnail must be at least 2 characters.'
          })
        }

        //set default vals
        let seriesOrder = null
        let _parent = null
        let thumbnail = null

        if (Number(req.body.series_order)) {
          seriesOrder = Number(req.body.series_order)
        }
        if (req.body.parent) {
          _parent = req.body.parent
        }
        if (trim(thumbnail)) {
          thumbnail = trim(thumbnail)
        }

        media.title = trim(req.body.title)
        media._parent = _parent
        media.seriesOrder = seriesOrder
        media.description = trim(req.body.description)
        media.thumbnail = thumbnail
        media.location = trim(req.body.location)

        media.save()
          .then((media) => {
            res.json(media)
          })
          .catch((e) => {
            res.status(500).json({
              error: e
            })
          })
      })
      .catch((e) => {
        res.status(400).json({
          error: e
        })
      })
} //end updateMedia

function deleteMedia(req, res) {
  if (req.query.frd == 'true') {
    //permanently remove the media
    Media.remove({_id: req.params.id})
    .then(() => {
      res.json({
        success: 'Media successfully deleted permanently'
      })
    })
    .catch((e) => {
      console.log(e)
      res.json({
        error: e
      })
    })
  } else {
    Media.findById(req.params.id)
        .then((media) => {
          media.removed = true

          media.save()
            .then((media) => {
              res.json(media)
            })
            .catch((e) => {
              res.status(500).json({
                error: e
              })
            })
        })
        .catch((e) => {
          res.status(400).json({
            error: e
          })
        })
  }
} //end deleteMedia

module.exports = {
  getMedia,
  getMedias,
  createMedia,
  updateMedia,
  deleteMedia
}
