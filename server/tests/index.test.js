const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../../index')
const { populateMedias } = require('./seed/seed')

beforeEach(populateMedias)

describe('media endpoints', () => {
  it('should get media results', (done) => {
    request(app)
      .get('/api/media')
      //.set('x-auth', users[0].tokens[0].token)
      .set('Accept', 'application/json; charset=utf-8')
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        expect(res.body.length).toBe(2)
      })
      .end(done)
  }) //end should get todos
})
