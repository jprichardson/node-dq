Node.js - dq
============

dq is a simple priority queue built on Redis.


Install
-------

    npm install --save dq



Usage
-----

### connect(config, [callback])

alias: `create()`

1. `config`: Can take any of the following:
  a. `name` (required)
  b. `port`, defaults to `6379`
  c. `host`, defaults '127.0.0.1'
  d. `password`
2. `callback`: optional, has signature `(err, q)`

**Example:**

```js
var dq = require('dq')

var q = dq.connect({name: 'tasks'})

// or...

dq.connect({name: 'tasks'}, function (err, q) {

})
```

### count(callback)

- `callback`: has signature `(err, count)`

**Example:**

```js
var dq = require('dq')

var q = dq.connect({name: 'tasks'})
q.count(function (err, count) {
  console.log(count) // => 1356
})
```



#### peak(start, count, [callback])

Return data from `start` until `start + count`, but don't remove the data.

**example:**

Assume the queue has  the following contents: `['a', 'b', 'c', 'd']`

```js
var dq = require('dq')

dq.create({name: 'somedata'}, function (err, q) {
  q.peak(1, 2, function (err, data) {
    console.dir(data) // => ['b', 'c']
  })
})
```


## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012-2013 JP Richardson

