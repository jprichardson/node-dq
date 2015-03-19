Node.js - dq
============

dq is a stupidly simple data queue built on Redis. It is not a messaging queue or a job queue. If you want a job queue, you should checkout [Kue](http://learnboost.github.com/kue/).



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





### dq-import


    Usage: dq-import [options]

    Options:

      -h, --help                  output usage information
      -V, --version               output the version number
      -f, --file [inputFile]      input file otherwise the default is STDIN
      -h, --host [host]           host of redis server, the default is localhost
      -a, --auth [password]       password of redis server
      -p, --port [number]         port of redis server, the default is 6379
      -q, --queue [queueName]     name of the queue
      -s, --shuffle               insert in random order



**Examples:**

    $ cat my_data_set.txt | dq-import --queue mydataset

or..

    $ dq-import --queue mydataset --file my_data_set.txt


### dq-export


    Usage: dq-export [options]

    Options:

      -h, --help                  output usage information
      -V, --version               output the version number
      -f, --file [outputFile]     output file otherwise the default is STDOUT
      -h, --host [host]           host of redis server, the default is localhost
      -a, --auth [password]       password of redis server
      -p, --port [number]         port of redis server, the default is 6379
      -q, --queue [queueName]     name of the queue



**Examples:**

    $ dq-export --queue mydataset > my_data_set.txt

or..

    $ dq-export --queue mydataset --file my_data_set.txt


## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012-2013 JP Richardson

