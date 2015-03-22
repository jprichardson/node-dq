var assert = require('assert')
var async = require('async')
var dq = require('../')
require('terst')

/* global beforeEach, describe, F, it */
/* eslint-disable no-spaced-func */

var TESTQ_NAME = 'testq'

describe('dq', function () {
  var q

  beforeEach(function (done) {
    dq.delete({name: TESTQ_NAME}, function () {
      q = dq.connect({name: TESTQ_NAME})
      done()
    })
  })

  describe('- enq()', function () {
    describe('> when no priority', function () {
      it('should enq', function (done) {
        var data = ['a', 'b', 'c']
        async.forEach(data, q.enq.bind(q), function (err) {
          F (err)
          q.redisClient.zrange(q.key, 0, 2, function (err, res) {
            F (err)
            assert.deepEqual(data, res)
            done()
          })
        })
      })

      it('should enq (note, does not preserve insertion order)', function (done) {
        var data = ['a', 'c', 'b']
        async.forEach(data, q.enq.bind(q), function (err) {
          F (err)
          q.redisClient.zrange(q.key, 0, 2, function (err, res) {
            F (err)
            assert.deepEqual(res, ['a', 'b', 'c'])
            done()
          })
        })
      })
    })

    describe('> when priority', function () {
      it('should enq in order', function (done) {
        var data = [['a', 0.5], ['b', 0.1], ['c', 0.7], ['d', 0.3]]
        async.forEach(data, function (i, cb) { q.enq.apply(q, [i[0], i[1], cb]) }, function (err) {
          F (err)
          q.redisClient.zrange(q.key, 0, 3, function (err, res) {
            F (err)
            assert.deepEqual(res, ['b', 'd', 'a', 'c'])
            done()
          })
        })
      })
    })
  })
})
