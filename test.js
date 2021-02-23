'use-strict'
// test suite hook-up -------------------------------------------------------
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('chai').assert

const server = require('./index')

chai.use(chaiHttp)

it('success true on ping /GET', function (done) {
    chai.request(server)
        .get('/api/ping')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                assert.equal(res.body.success, true)
                done()
            } else {
                console.log(err)
            }

        })
})

it('throws error when no query params are sent to /api/posts /GET', function (done) {
    chai.request(server)
        .get('/api/posts')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 500)
                assert.equal(res.body.error, 'Tags parameter is required')
                done()
            } else {
                console.log(err)
            }

        })
})


it('tags - 1 /api/posts?tags=tech /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }

        })
})