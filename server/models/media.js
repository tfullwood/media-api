const mongoose = require('mongoose')
const Schema = mongoose.Schema
var ObjectId = mongoose.Types.ObjectId

const MediaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  _parent: {
    type: Schema.Types.ObjectId,
    ref: 'Media'
  },
  seriesOrder: {
    type: Number
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String
  },
  location: {
    type: String,
    required: true
  }, removed: {
    type: Boolean,
    default: false
  }
})

MediaSchema.statics = {
  get(id) {
    //get a single media
    if (ObjectId.isValid(id)) {
      return this.findById(id).then((media) => {
        if (!media) {
          return Promise.reject({
            status: 400,
            message: 'No Media Found'
          })
        }

        return media
      })
      .catch((e) => {
        //console.log(e)
        return Promise.reject({
          status: e.status || 500,
          message: e.message || 'Internal Server Error'
        })
      })
    } else {
      return Promise.reject({
        status: 400,
        message: 'Invalid ID'
      })
    }
  }, //end get
  list(start, limit, search, removed) {
    var query = {}

    if (!removed) {
      query.removed = false
    }

    if (search) {
      var search = decodeURIComponent(search)

      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ]
    }

    return this.find(query)
      .skip(Number(start))
      .limit(Number(limit))
      .then((medias) => {
        return medias
      })
      .catch((e) => {
        return Promise.reject({
          status: e.status || 500,
          message: e.message || 'Internal Server Error'
        })
      })
  } //end list

} //end statics

var Media = mongoose.model('Media', MediaSchema)

module.exports = {
  Media
}
