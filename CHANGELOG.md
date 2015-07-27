0.9.0 / 2015-07-27
------------------
- added optional count parameter to `deq()`

0.8.0 / 2015-06-19
------------------
- upgraded to `hiredis@0.4` from `0.2` (trying to improve IO.js compatibility)

0.7.0 / 2015-04-21
------------------
- if `q.name` property changes, then so does `q.key`
- expose `PREFIX`

0.6.0 / 2015-03-22
------------------
- added `Queue.list()`

0.5.0 / 2015-03-19
------------------
- using JavaScript Standard Style
- added `peak()` method
- moved `dq-import` and `dq-export` to https://github.com/jprichardson/dq-cli
- implemented `connect()` method, same as `create()` (may remove `create()`, not sure)
- `connect()/create()` return an instance of `Queue` now
- default `enq()` priority changed to `0` instead of `-Infinity`

0.4.0 / 2013-10-13
------------------
* aliased `destroy()` to `delete()`
* added option to not quite on `destroy()`

0.3.1 / 2013-09-12
------------------
* don't call `auth` if no password is set

0.3.0 / 2013-09-12
------------------
* refactored dq-import, removed `-f` flag, fixed bug with `byline` module, node v0.10 only now
* refactored dq-export, removed `-f` flag

0.2.1 / 2013-01-15
------------------
* Remote bug.

0.2.0 / 2013-01-14
------------------
* Removed CoffeeScript
* Added method 'createFromRedisClient'
* Renamed `dq` to `dq-import`.
* Created `dq-export`.

0.1.1 /2012-04-11
-------------------
* Added `dq` binary to import files into the queues

0.0.5 / 2012-02-13
-------------------
* Added Redis auth support.

0.0.4 / 2012-02-13
-------------------
* Fixed dq key bug.

0.0.3 / 2012-02-12
-------------------
* enq() doesnt need a callback now, can be called with value and priority

0.0.2 / 2012-02-12
-------------------
* Added `quit()` method.

0.0.1 / 2012-02-12
-------------------
* First public release.
