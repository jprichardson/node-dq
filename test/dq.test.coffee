dq = require('../lib/dq.js')
testutil = require('testutil')

puts = console.log

TESTQ_NAME = 'testq'

describe 'dq', ->
  Q = null

  beforeEach (done) ->
    dq.delete name: TESTQ_NAME, (err) ->
      dq.create name: TESTQ_NAME, (err, q) ->
        Q = q
        done()

  describe '+ create()', ->
    it 'should create a Queue with default params', (done) ->
      dq.create name:'someQ', (err, q) ->
        T q.name is 'someQ'
        T q.host is '127.0.0.1'
        T q.port is 6379
        T q.key is 'dq:someQ'
        done()

    it 'should create a Queue with input params', (done) ->
      dq.create name:'someQ', host: '44.22.11.33', port: 6000, (err, q) ->
        T q.name is 'someQ'
        T q.host is '44.22.11.33'
        T q.port is 6000
        done()

    it 'should return an error if name doesnt exist', (done) ->
      dq.create {}, (err, q) ->
        T err isnt null
        done()
  
  
  describe '- enq()', ->
    it 'should enqueue a value with a priority', (done) ->
        Q.enq 'string1', (err, res) ->
          T err is null
          Q.count (err,res) ->
            T err is null
            T res is 1
            done()
               
    it 'should enqueue with only the value parameter', (done) ->
      Q.enq('someval')
      Q.enq('anotherval')
      setTimeout(->
        Q.count (err,res) ->
          T res is 2
          done()
      , 150)

    it 'should enqueue with only the value and priority parameters', (done) ->
      Q.enq('z', 20)
      Q.enq('a', 1)
      setTimeout(->
        Q.count (err, res) ->
          T res is 2
          done()
      , 150)

  describe '- count()', ->
    it 'should count the items in the queue', (done) ->
      Q.enq 'a', (err,res) ->
        #console.log 'hi ' + res
        Q.enq 'b', (err,res) ->
          Q.enq 'c', (err,res) ->
            Q.count (err,res) ->
              T res is 3
              done()

  
  describe '- deq()', ->
    it 'should dequeue in proper order', (done) ->
      Q.enq 'a', (err,res) ->
        Q.enq 'b', (err,res) ->
          Q.enq 'c', (err,res) ->
            Q.deq (err,res) ->
              T res is 'a'
              Q.deq (err,res) ->
                T res is 'b'
                Q.deq (err,res) ->
                  T res is 'c'
                  Q.deq (err, res) ->
                    T err is null
                    T res is undefined
                    done()
  
    it 'should dequeue in proper order', (done) ->
      Q.enq 'a', 0, (err,res) ->
        Q.enq 'b', -1, (err,res) ->
          Q.enq 'c', 1, (err,res) ->
            Q.deq (err,res) ->
              T res is 'b'
              Q.deq (err,res) ->
                T res is 'a'
                Q.deq (err,res) ->
                  T res is 'c'
                  Q.deq (err, res) ->
                    T err is null
                    T res is undefined
                    done()

  describe '- quit()', ->
    it 'should set the hasQuit flag', (done) ->
      dq.create name: 'blah', (err, q) ->
        F q.hasQuit
        q.quit ->
          T q.hasQuit
          done()
       