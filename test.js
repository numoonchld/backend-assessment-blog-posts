// test suite hook-up -------------------------------------------------------
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect

const server = require('./index')

chai.use(chaiHttp)

describe('Blobs', function () {
    it('should get success true on ping')
})

it('should get success true on ping', function (done) {
    chai.request(server)
        .get('/api/ping')
        .end(function (err, res) {
            expect(res).to.have.status(200)
            done()
        })
})