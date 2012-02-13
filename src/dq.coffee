redis = require('redis')
util = require('util')

PREFIX = 'dq'

class Queue
  #redisClient: null
  hasQuit: false
  #key: ''

  constructor: (@name, @port, @host) ->
    @redisClient = redis.createClient(@port, @host)
    @key = PREFIX + ':' + @name

  count: (callback) ->
    @redisClient.zcard @key, callback

  delete: (callback) ->
    @redisClient.del @key, (err) =>
      @redisClient.quit callback

  deq: (callback) ->
    @redisClient.multi().zrange(@key, 0, 0).zremrangebyrank(@key, 0, 0).exec (err,res) ->
      if err? then callback(err, null); return;
      if res?
        if util.isArray(res)
          callback(null, res[0][0])
        else
          callback(new Error('Invalid Redis response.'), null)

  enq: (val, priority, callback) -> 
    switch arguments.length
      when 1 then priority = -Infinity
      when 2
        if typeof priority is 'function' #if called without priority
          callback = priority 
          priority = -Infinity

    @redisClient.zadd @key, priority, val, callback

  quit: (callback) ->
    @hasQuit = true
    @redisClient.quit callback

  @create: (params={}, callback) ->
    name = params.name 
    port = params.port or= 6379
    host = params.host or= '127.0.0.1'
    error = null
    error = new Error('Must pass name to input.') unless name?

    q = new Queue(name, port, host)
    callback(error, q)

  @delete: (params={}, callback) ->
    Queue.create params, (err,q) ->
      q.delete callback

module.exports.create = Queue.create
module.exports.delete = Queue.delete