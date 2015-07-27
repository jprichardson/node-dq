var dq = require('../')
require('terst')

/* global describe, it, T */
/* eslint-disable no-spaced-func */
// trinity: mocha

describe('dq', function () {
  describe('+ list()', function () {
    it('should list all queues on the system', function (done) {
      var dq1 = dq.connect({name: 'testq1'})
      var dq2 = dq.connect({name: 'testq2'})
      var dq3 = dq.connect({name: 'testq3'})

      dq1.enq('hi1')
      dq2.enq('hi2')
      dq3.enq('hi3')

      setTimeout(function () {
        dq.list({}, function (err, qs) {
          if (err) return done(err)
          T (qs.indexOf('testq1') >= 0)
          T (qs.indexOf('testq2') >= 0)
          T (qs.indexOf('testq3') >= 0)
          done()
        })
      }, 100)
    })
  })
})
