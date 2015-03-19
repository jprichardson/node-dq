var dq = require('../lib/dq.js')
require('testutil')

/* global beforeEach, describe, F, it, T */
/* eslint-disable no-spaced-func */

var TESTQ_NAME = 'testq'

describe('dq', function () {
  var Q = null
  beforeEach(function (done) {
    dq.delete({name: TESTQ_NAME}, function (err) {
      F (err)
      dq.create({name: TESTQ_NAME}, function (err, q) {
        F (err)
        Q = q
        done()
      })
    })
  })

  describe('+ create()', function () {
    it('should create a Queue with input params', function (done) {
      dq.create({name: 'someQ'}, function (err, q) {
        F (err)
        T (q.name === 'someQ')
        done()
      })
    })

    it('should  an error if name doesnt exist', function (done) {
      dq.create({}, function (err, q) {
        T (err)
        done()
      })
    })
  })

  describe('- enq()', function () {
    it('should enqueue a value with a priority', function (done) {
      Q.enq('string1', function (err, res) {
        F (err)
        Q.count(function (err, res) {
          F (err)
          T (res === 1)
          done()
        })
      })
    })

    it('should enqueue with only the value parameter', function (done) {
      Q.enq('someval')
      Q.enq('anotherval')
      setTimeout(function () {
        Q.count(function (err, res) {
          F (err)
          T (res === 2)
          done()
        })
      }, 150)
    })

    it('should enqueue with only the value and priority parameters', function (done) {
      Q.enq('z', 20)
      Q.enq('a', 1)
      setTimeout(function () {
        Q.count(function (err, res) {
          F (err)
          T (res === 2)
          done()
        })
      }, 150)
    })
  })

  describe('- count()', function () {
    it('should count the items in the queue', function (done) {
      Q.enq('a', function (err, res) {
        F (err)
        Q.enq('b', function (err, res) {
          F (err)
          Q.enq('c', function (err, res) {
            F (err)
            Q.count(function (err, res) {
              F (err)
              T (res === 3)
              done()
            })
          })
        })
      })
    })
  })

  describe('- deq()', function () {
    it('should dequeue in proper order', function (done) {
      Q.enq('a', function (err, res) {
        F (err)
        Q.enq('b', function (err, res) {
          F (err)
          Q.enq('c', function (err, res) {
            F (err)
            Q.deq(function (err, res) {
              F (err)
              T (res === 'a')
              Q.deq(function (err, res) {
                F (err)
                T (res === 'b')
                Q.deq(function (err, res) {
                  F (err)
                  T (res === 'c')
                  Q.deq(function (err, res) {
                    F (err)
                    F (res)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })

    it('should dequeue in proper order', function (done) {
      Q.enq('a', 0, function (err, res) {
        F (err)
        Q.enq('b', -1, function (err, res) {
          F (err)
          Q.enq('c', 1, function (err, res) {
            F (err)
            Q.deq(function (err, res) {
              F (err)
              T (res === 'b')
              Q.deq(function (err, res) {
                F (err)
                T (res === 'a')
                Q.deq(function (err, res) {
                  F (err)
                  T (res === 'c')
                  Q.deq(function (err, res) {
                    T (err === null)
                    T (res === void 0)
                    done()
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  describe('- quit()', function () {
    it('should set the hasQuit flag', function (done) {
      dq.create({name: 'blah'}, function (err, q) {
        F (err)
        F (q.hasQuit)
        q.quit(function () {
          T (q.hasQuit)
          done()
        })
      })
    })
  })
})
