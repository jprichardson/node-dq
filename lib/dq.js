var assert = require('assert')
var redis = require('redis')

// redis.debug_mode = true

var PREFIX = 'dq'

function Queue (name, redisClient) {
  this.hasQuit = false
  this.name = name
  this.redisClient = redisClient
  this.key = PREFIX + ':' + this.name
}

Queue.prototype.count = function (callback) {
  this.redisClient.zcard(this.key, callback)
}

Queue.prototype['delete'] = function (shouldNotQuit, callback) {
  if (typeof shouldNotQuit === 'function') {
    callback = shouldNotQuit
    shouldNotQuit = false
  }

  var _this = this
  this.redisClient.del(this.key, function (err) {
    if (err) return callback(err)
    if (shouldNotQuit) return callback()
    _this.redisClient.quit(callback)
  })
}
Queue.prototype.destroy = Queue.prototype.delete

Queue.prototype.deq = function (callback) {
  this.redisClient.multi().zrange(this.key, 0, 0).zremrangebyrank(this.key, 0, 0).exec(function (err, res) {
    if (err) return callback(err)
    if (!res || !Array.isArray(res)) return callback(new Error('Invalid Redis response.'))

    callback(null, res[0][0])
  })
}

Queue.prototype.enq = function (val, priority, callback) {
  switch (arguments.length) {
    case 1:
      priority = -Infinity
      break
    case 2:
      if (typeof priority === 'function') {
        callback = priority
        priority = -Infinity
      }
  }
  return this.redisClient.zadd(this.key, priority, val, callback)
}

Queue.prototype.peak = function (start, count, callback) {
  var end = start + count - 1
  this.redisClient.zrange(this.key, start, end, callback)
}

Queue.prototype.quit = function (callback) {
  this.hasQuit = true
  this.redisClient.quit(callback)
}

Queue.create = function (params, callback) {
  params = params || {}
  var name = params.name
  var port = params.port || 6379
  var host = params.host || '127.0.0.1'
  var password = params.password

  if (name == null) return callback(Error('Must pass queue name to input.'))

  var rc = redis.createClient(port, host)

  if (password) rc.auth(password)

  rc.on('error', function (err) {
    callback && callback(err)
  })

  return Queue.createFromRedisClient(name, rc, callback)
}
Queue.connect = Queue.create

Queue.createFromRedisClient = function createFromRedisClient (name, redisClient, callback) {
  var q = new Queue(name, redisClient)
  callback && callback(null, q)
  return q
}

Queue.delete = function (params, callback) {
  assert(params, 'Must pass at least the name.')
  assert(params.name, 'Must pass the name.')

  Queue.create(params, function (err, q) {
    if (err) return callback(err)
    q.delete(callback)
  })
}

module.exports = Queue
