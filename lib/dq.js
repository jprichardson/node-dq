var redis = require('redis')
  , util = require('util')

PREFIX = 'dq'

function Queue(name, redisClient) {
  this.hasQuit = false;
  this.name = name;
  this.redisClient = redisClient
  this.key = PREFIX + ':' + this.name;
}

Queue.prototype.count = function(callback) {
  this.redisClient.zcard(this.key, callback);
}

Queue.prototype["delete"] = function(callback) {
  var _this = this;
  this.redisClient.del(this.key, function(err) {
    _this.redisClient.quit(callback);
  })
}

Queue.prototype.deq = function(callback) {
  this.redisClient.multi().zrange(this.key, 0, 0).zremrangebyrank(this.key, 0, 0).exec(function(err, res) {
    if (err) return callback(err, null);
    
    if (res) {
      if (util.isArray(res))
        callback(null, res[0][0])
      else
        callback(new Error('Invalid Redis response.'), null)
    }
  })
}

Queue.prototype.enq = function(val, priority, callback) {
  switch (arguments.length) {
    case 1:
      priority = -Infinity;
      break;
    case 2:
      if (typeof priority === 'function') {
        callback = priority;
        priority = -Infinity;
      }
  }
  return this.redisClient.zadd(this.key, priority, val, callback);
}

Queue.prototype.quit = function(callback) {
  this.hasQuit = true;
  this.redisClient.quit(callback);
}

Queue.create = function(params, callback) {
  params = params || {}
  var name = params.name
    , port = params.port || 6379
    , host = params.host || '127.0.0.1'
    , password = params.password
  
  if (name == null) return callback(Error('Must pass queue name to input.'))

  var rc = redis.createClient(this.port, this.host)
  if (password) 
    rc.auth(password, function() {
      Queue.createFromRedisClient(name, rc, callback)
    })
  else
    Queue.createFromRedisClient(name, rc, callback)

  return;
  q = new Queue(name, port, host, password);
  if (password != null) {
    return q.redisClient.auth(password, function() {
      return callback(error, q);
    });
  } else {
    return callback(error, q);
  }
};

Queue.createFromRedisClient = function createFromRedisClient (name, redisClient, callback) {
  var q = new Queue(name, redisClient)
  callback(null, q)
}

Queue["delete"] = function(params, callback) {
  if (params == null) params = {};
  Queue.create(params, function(err, q) {
    q["delete"](callback);
  })
}

module.exports.create = Queue.create
module.exports.createFromRedisClient = Queue.createFromRedisClient
module.exports["delete"] = Queue["delete"]


