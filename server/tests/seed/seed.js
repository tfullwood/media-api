const { ObjectID } = require('mongodb')

const { Media } = require('../../models/media')

const mediaIdOne = new ObjectID
const mediaIdTwo = new ObjectID

const medias = [{
    _id: mediaIdOne,
    title: 'Test Media Title 1',
    description: 'Test media description 1',
    thumbnail: 'http://localhost:3000/public/media1.jpg',
    location: 'location=http://localhost:3000/public/media/media1.mp4'
  }, {
    _id: mediaIdTwo,
    title: 'Test Media Title 2',
    description: 'Test media description 2',
    thumbnail: 'http://localhost:3000/public/media2.jpg',
    location: 'location=http://localhost:3000/public/media/media2.mp4'
  }
]

const populateMedias = (done) => {
  Media.remove({}).then(() => {
    return Media.insertMany(medias)
  }).then(() => done())
}

module.exports = {
  populateMedias
}
