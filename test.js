'use-strict'
// test suite hook-up -------------------------------------------------------
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = require('chai').assert

const server = require('./index')

chai.use(chaiHttp)

it('succeeds on ping /GET', function (done) {
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

it('errors when no tag query params are sent to /api/posts /GET', function (done) {
    chai.request(server)
        .get('/api/posts')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 400)
                assert.equal(res.body.error, 'Tags parameter is required')
                done()
            } else {
                console.log(err)
            }

        })
})

it('errors when no tag query params but sortBy and direction are sent to /api/posts /GET', function (done) {
    chai.request(server)
        .get('/api/posts?sortBy=id&direction=asc')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 400)
                assert.equal(res.body.error, 'Tags parameter is required')
                done()
            } else {
                console.log(err)
            }

        })
})

it('succeeds if single tag - /api/posts?tags=tech /GET', function (done) {
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

it('succeeds if two tags - /api/posts?tags=tech,health /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})

it('succeeds if three tags - /api/posts?tags=tech,health,politics /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health,politics')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})

it('errors out if direction is given without sortBy parameter /api/posts?tags=tech,health&direction=asc', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&direction=asc')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 400)
                assert.equal(res.body.error, 'sortBy parameter is needed if direction is specified')
                done()
            } else {
                console.log(err)
            }
        })
})

it('succeeds with valid sortBy - api/posts?tags=tech,health&sortBy=reads /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=reads')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})

it('errors with invalid sortBy - /api/posts?tags=tech,health&sortBy=author /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=author')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 400)
                assert.equal(res.body.error, 'sortBy parameter is invalid')
                done()
            } else {
                console.log(err)
            }
        })
})

it('succeeds with valid sortBy - /api/posts?tags=tech,health&sortBy=id /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=id')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})

it('succeeds with valid sortBy and direction - /api/posts?tags=tech,health&sortBy=id&direction=desc /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=id&direction=desc')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})


it('succeeds with valid sortBy and direction - /api/posts?tags=tech,health&sortBy=likes&direction=asc /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=likes&direction=asc')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 200)
                done()
            } else {
                console.log(err)
            }
        })
})

it('errors with invalid direction parameter - /api/posts?tags=tech,health&sortBy=id&direction=test /GET', function (done) {
    chai.request(server)
        .get('/api/posts?tags=tech,health&sortBy=id&direction=test')
        .end(function (err, res) {
            if (!err) {
                assert.equal(res.statusCode, 400)
                assert.equal(res.body.error, 'direction parameter is invalid')
                done()
            } else {
                console.log(err)
            }
        })
})