[![build status](https://secure.travis-ci.org/jprichardson/node-dq.png)](http://travis-ci.org/jprichardson/node-dq)
Node.js - dq
============

dq is a stupidly simple data queue built on Redis. It is not a messaging queue or a job queue. If you want a job queue, you should checkout [Kue][kue].



Install
-------

    npm install dq



Usage
-----

### Programatically

    dq = require('dq')

    dq.create name: 'mydata', (err, q) ->
      q.enq('some data')
      q.enq('smore data... hehehe')

(More to come later.)


### Command Line

`
  Usage: dq [options]

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -f, --file [inputFile]      input file otherwise the default is STDIN
    -h, --host [host]           host of redis server, the default is localhost
    -a, --auth [password]       password of redis server
    -p, --port [number]         port of redis server, the default is 6379
    -n, --name [queueName]      name of the queue
    -s, --shuffle               insert in random order

`

**Examples:**

    $ cat my_data_set.txt | dq --name mydataset

or..

    $ dq --name mydataset --file my_data_set.txt


TODO
----

1. fluent interface
2. REST API


## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012 JP Richardson