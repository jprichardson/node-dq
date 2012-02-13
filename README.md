# Node.js - dq

dq is a stupidly simple data queue built on Redis. It is not a messaging queue or a job queue. If you want a job queue, you should checkout [Kue][kue].



## Install

    npm install dq



## Usage

    dq = require('dq')

    dq.create name: 'mydata', (err, q) ->
      q.enq('some data')
      q.enq('smore data... hehehe')

(More to come later.)



## TODO

1. fluent interface
2. REST API


## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012 JP Richardson