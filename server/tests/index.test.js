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
  it('should update a media record', (done) => {
    var title = 'New Title'
    var description = 'New description'
    var thumbnail = 'http://localhost:3000/public/new_image.jpg'
    var location = 'location=http://localhost:3000/public/media/new_location.mp4'

    request(app)
      .put(`/api/media/${medias[0]._id}`)
      .set('Content-Type', 'application/json')
      .send({
        title,
        description,
        thumbnail,
        location
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title)
        expect(res.body.description).toBe(description)
        expect(res.body.thumbnail).toBe(thumbnail)
        expect(res.body.location).toBe(location)
        expect(res.body.removed).toBe(false)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findOne({title}).then((media) => {
          expect(media).toEqual(expect.anything())
          expect(media.title).toBe(title)
          expect(media.description).toBe(description)
          expect(media.thumbnail).toBe(thumbnail)
          expect(media.location).toBe(location)
          expect(media.removed).toBe(false)

          done()
        }).catch((e) => done(e))
      })
  }) //end should put

  //delete
  it('should delete flag a media record as removed', (done) => {
    request(app)
      .delete(`/api/media/${medias[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.anything())
        expect(res.body.removed).toBe(true)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findById(medias[0]._id).then((media) => {
          expect(media).toEqual(expect.anything())
          expect(media.removed).toBe(true)

          done()
        }).catch((e) => done(e))
      })
  }) //end should delete

  //delete frd
  it('should delete a media record frd', (done) => {
    request(app)
      .delete(`/api/media/${medias[0]._id}?frd=true`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe('Media successfully deleted permanently')
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.find().then((medias) => {
          expect(medias.length).toEqual(1)

          done()
        }).catch((e) => done(e))
      })
  }) //end should delete frd
})

describe('media genre endpoints', () => {
  //post
  it('should add a genre record to a media record', (done) => {
    var title = 'New Genre POST'

    request(app)
      .post(`/api/media/${medias[0]._id}/genre`)
      .set('Content-Type', 'application/json')
      .send({
        title
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.genre).toEqual(expect.anything())

        expect(res.body.genre[1].title).toBe(title)
        expect(res.body.genre[1].removed).toBe(false)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findById(medias[0]._id).then((media) => {
          expect(media).toEqual(expect.anything())
          expect(media.genre[1].title).toBe(title)
          expect(media.genre[1].removed).toBe(false)

          done()
        }).catch((e) => done(e))
      })
  }) //end should post

  //put
  it('should update a media record', (done) => {
    var title = 'New Genre Title'

    request(app)
      .put(`/api/media/${medias[0]._id}/genre/${medias[0].genre[0]._id}`)
      .set('Content-Type', 'application/json')
      .send({
        title
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.genre).toEqual(expect.anything())

        expect(res.body.genre[0].title).toBe(title)
        expect(res.body.genre[0].removed).toBe(false)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findById(medias[0]._id).then((media) => {
          expect(media).toEqual(expect.anything())
          expect(media.genre[0].title).toBe(title)
          expect(media.genre[0].removed).toBe(false)

          done()
        }).catch((e) => done(e))
      })
  }) //end should put

  //delete genre
  it('should flag a genre as removed on a media record', (done) => {
    request(app)
      .delete(`/api/media/${medias[0]._id}/genre/${medias[0].genre[0]._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.genre).toEqual(expect.anything())
        expect(res.body.genre[0].removed).toBe(true)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findById(medias[0]._id).then((media) => {
          expect(media.genre).toEqual(expect.anything())
          expect(media.genre[0].removed).toBe(true)

          done()
        }).catch((e) => done(e))
      })
  }) //end should delete

  //delete frd
  it('should delete frd a genre in a media record', (done) => {
    request(app)
      .delete(`/api/media/${medias[0]._id}/genre/${medias[0].genre[0]._id}?frd=true`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(expect.anything())
        expect(res.body.genre.length).toEqual(0)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        //Verify value in DB
        Media.findById(medias[0]._id).then((media) => {
          expect(media.genre).toEqual(expect.anything())
          expect(media.genre.length).toEqual(0)

          done()
        }).catch((e) => done(e))
      })
  }) //end should delete frd
})
