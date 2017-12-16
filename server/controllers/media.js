const { Media } = require('../models/media')

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

//getMedias
function getMedias(req, res) {
  var start = req.query.start || 0
  var limit = req.query.limit || 50
  var search = req.query.search || null

  Media.list(start, limit, search)
    .then((medias) => {
      return res.json(medias)
    })
    .catch((e) => {
      return res.status(e.status).json({
        error: e.message
      })
    })
}

//createMedia

//updateMedia

//deleteMedia

module.exports = {
  getMedia,
  getMedias
}
