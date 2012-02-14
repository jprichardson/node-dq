(function() {
  var PREFIX, Queue, redis, util;

  redis = require('redis');

  util = require('util');

  PREFIX = 'dq';

  Queue = (function() {

    Queue.prototype.hasQuit = false;

    function Queue(name, port, host, password) {
      this.name = name;
      this.port = port;
      this.host = host;
      this.password = password;
      this.redisClient = redis.createClient(this.port, this.host);
      this.key = PREFIX + ':' + this.name;
    }

    Queue.prototype.count = function(callback) {
      return this.redisClient.zcard(this.key, callback);
    };

    Queue.prototype["delete"] = function(callback) {
      var _this = this;
      return this.redisClient.del(this.key, function(err) {
        return _this.redisClient.quit(callback);
      });
    };

    Queue.prototype.deq = function(callback) {
      return this.redisClient.multi().zrange(this.key, 0, 0).zremrangebyrank(this.key, 0, 0).exec(function(err, res) {
        if (err != null) {
          callback(err, null);
          return;
        }
        if (res != null) {
          if (util.isArray(res)) {
            return callback(null, res[0][0]);
          } else {
            return callback(new Error('Invalid Redis response.'), null);
          }
        }
      });
    };

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
    };

    Queue.prototype.quit = function(callback) {
      this.hasQuit = true;
      return this.redisClient.quit(callback);
    };

    Queue.create = function(params, callback) {
      var error, host, name, password, port, q;
      if (params == null) params = {};
      name = params.name;
      port = params.port || (params.port = 6379);
      host = params.host || (params.host = '127.0.0.1');
      password = params.password;
      error = null;
      if (name == null) error = new Error('Must pass name to input.');
      q = new Queue(name, port, host, password);
      if (password != null) {
        return q.redisClient.auth(password, function() {
          return callback(error, q);
        });
      } else {
        return callback(error, q);
      }
    };

    Queue["delete"] = function(params, callback) {
      if (params == null) params = {};
      return Queue.create(params, function(err, q) {
        return q["delete"](callback);
      });
    };

    return Queue;

  })();

  module.exports.create = Queue.create;

  module.exports["delete"] = Queue["delete"];

}).call(this);
