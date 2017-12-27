const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../../index')
const { Media } = require('../models/media')
const { medias, populateMedias } = require('./seed/seed')

beforeEach(populateMedias)

describe('media endpoints', () => {
  it('should get media results', (done) => {
    request(app)
      .get('/api/media')
      //.set('x-auth', users[0].tokens[0].token)
      .set('Accept', 'application/json; charset=utf-8')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2)
      })
      .end(done)
  }) //end should get media results

  it('should get one media result', (done) => {
    request(app)
      .get(`/api/media/${medias[0]._id.toHexString()}`)
      .set('Accept', 'application/json; charset=utf-8')
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(medias[0].title)
        expect(res.body.removed).toBe(false)
      })
      .end(done)
  }) //end should get single result

  it('should add a media record to the database', (done) => {
    var title = 'Test Post Title'
    var description = 'Test post description'
    var thumbnail = 'http://localhost:3000/public/media1.jpg'
    var location = 'location=http://localhost:3000/public/media/media1.mp4'
    var genre_title = 'Action'

    request(app)
      .post('/api/media')
      .set('Content-Type', 'application/json')
      .send({
        title,
        description,
        thumbnail,
        location,
        genre_title
      })
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toEqual(expect.anything())
        expect(res.body.title).toBe(title)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        Media.findOne({title}).then((media) => {
          expect(media).toEqual(expect.anything())
          expect(media.genre[0].title).toBe(genre_title)
          done()
        }).catch((e) => done(e))
      })
  }) //end should post

  //put

  //delete

  //delete frd
})

describe('media genre endpoints', () => {
  //post

  //put

  //delete

  //delete frd
})
