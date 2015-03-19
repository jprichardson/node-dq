var util = require('util')
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
    if (err) return callback(err, null)

    if (res) {
      if (util.isArray(res)) {
        callback(null, res[0][0])
      } else {
        callback(new Error('Invalid Redis response.'), null)
      }
    }
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
    callback(err)
  })

  Queue.createFromRedisClient(name, rc, callback)
}

Queue.createFromRedisClient = function createFromRedisClient (name, redisClient, callback) {
  var q = new Queue(name, redisClient)
  callback(null, q)
}

Queue.delete = function (params, callback) {
  if (params == null) params = {}
  Queue.create(params, function (err, q) {
    if (err) return callback(err)
    q.delete(callback)
  })
}

module.exports.create = Queue.create
module.exports.createFromRedisClient = Queue.createFromRedisClient
module.exports.delete = Queue.delete
module.exports.destroy = Queue.delete
