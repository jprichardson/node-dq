var redis = require('redis')

// redis.debug_mode = true

function Queue (name, redisClient) {
  this.hasQuit = false
  this._name = name
  this.redisClient = redisClient
  this._key = Queue.PREFIX + this.name
}
Queue.PREFIX = 'dq:'

Object.defineProperty(Queue.prototype, 'name', {
  enumerable: true, configurable: false,
  get: function () {
    return this._name
  },
  set: function (value) {
    this._name = value
    this._key = Queue.PREFIX + value
  }
})

Object.defineProperty(Queue.prototype, 'key', {
  enumerable: true, configurable: false,
  get: function () {
    return this._key
  }
})

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

Queue.prototype.deq = function (count, callback) {
  if (typeof count === 'function') {
    callback = count
    count = 1
  }

  this.redisClient.multi().zrange(this.key, 0, count - 1).zremrangebyrank(this.key, 0, count - 1).exec(function (err, res) {
    if (err) return callback(err)
    if (!res || !Array.isArray(res)) return callback(new Error('Invalid Redis response.'))

    if (count === 1) callback(null, res[0][0])
    else callback(null, res[0])
  })
}

Queue.prototype.enq = function (val, priority, callback) {
  if (typeof val !== 'string') console.warn('warning: enq() value is not a string')

  switch (arguments.length) {
    case 1:
      priority = 0
      break
    case 2:
      if (typeof priority === 'function') {
        callback = priority
        priority = 0
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
  if (!params.name) return callback(new Error('Must pass the name.'))

  Queue.create(params, function (err, q) {
    if (err) return callback(err)
    q.delete(callback)
  })
}

Queue.list = function (params, callback) {
  params.name = '__TEMP_LIST_DISCOVERY'
  Queue.connect(params, function (err, q) {
    if (err) return callback(err)
    q.redisClient.keys('*', function (err, keys) {
      if (err) return callback(err)
      keys = keys.filter(function (key) {
        return key.indexOf(Queue.PREFIX) === 0
      }).map(function (key) {
        return key.replace(Queue.PREFIX, '')
      })
      callback(null, keys)
    })
  })
}

module.exports = Queue
