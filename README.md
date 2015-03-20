Node.js - dq
============

dq is a simple priority queue built on Redis.


Install
-------

    npm install dq



Usage
-----

### Example

```js
var dq = require('dq')

dq.create({name: 'mydata'}, function (err, q) {
  q.enq('some data')
  q.enq('smore data... hehehe')
})
```


### Methods

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

