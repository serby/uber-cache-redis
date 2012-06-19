# Redis engine for Uber Cache

[![build status](https://secure.travis-ci.org/serby/uber-cache-redis.png)](http://travis-ci.org/serby/uber-cache-redis)

## Installation

      npm install uber-cache-redis

## Usage

```js

var cache = require('uber-cache').createUberCache({ engine: require('uber-cache-redis')() });

cache.set('the key', 'the value', function(error) {
  cache.get('the key', function(error, value) {
    console.log(value);
  });
});

```

## Credits
[Paul Serby](https://github.com/serby/) follow me on [twitter](http://twitter.com/serby)

## Licence
Licenced under the [New BSD License](http://opensource.org/licenses/bsd-license.php)
