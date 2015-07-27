var dq = require('../')
var Queue = dq
require('terst')

/* global describe, EQ, F, it, T */
/* eslint-disable no-spaced-func */
// trinity: mocha

var TESTQ_NAME = 'testq'

describe('dq', function () {
  describe('+ connect()', function () {
    it('should return an instance of Queue', function (done) {
      var q = dq.connect({name: TESTQ_NAME})
      T (q instanceof Queue)
      done()
    })

    it('should return an instance and then be able to perform an operation', function (done) {
      var q = dq.connect({name: TESTQ_NAME})
      q.enq('hi', function (err) {
        F (err)
        q.peak(0, 1, function (err, res) {
          F (err)
          EQ (res[0], 'hi')
          done()
        })
      })
    })
  })
})
