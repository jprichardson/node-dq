var assert = require('assert')
var async = require('async')
var dq = require('../')

/* global describe it */
// trinity: mocha

describe('dq', function () {
  describe('+ deq()', function () {
    describe('> when multiple number passed', function () {
      it('should return requested amount', function (done) {
        var q = dq.connect({name: 'testq1'})
        var items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
        async.forEach(items, q.enq.bind(q), function (err) {
          assert.ifError(err)

          q.deq(5, function (err, newItems) {
            assert.ifError(err)
            assert.deepEqual(newItems, ['a', 'b', 'c', 'd', 'e'])
            done()
          })
        })
      })

      describe('> when more are requested than what it exists', function () {
        it('should return all remaining', function (done) {
          var q = dq.connect({name: 'testq' - Date.now()})
          var items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
          async.forEach(items, q.enq.bind(q), function (err) {
            assert.ifError(err)

            q.deq(50, function (err, newItems) {
              assert.ifError(err)
              assert.deepEqual(newItems, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])
              done()
            })
          })
        })
      })
    })
  })
})
