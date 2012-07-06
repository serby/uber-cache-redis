var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , redis = require('redis');

module.exports = function(options) {

  var client = redis.createClient()
    , handle = new EventEmitter();

  client.on('error', function(err) {
    handle.emit('error', err);
  });

  handle.set = function(key, value, ttl, callback) {
    if (typeof ttl === 'function') {
      callback = ttl;
      ttl = undefined;
    }

    if (typeof key === 'undefined') {
      var err = new Error('Invalid key undefined');
      handle.emit('error', err);
      throw err;
    }

    if ((typeof(ttl) === 'number') && (parseInt(ttl, 10) === ttl)) {
      client.setex(key, ttl, value, callback);
    } else {
      client.set(key, value, callback);
    }
  };

  handle.get = function(key, callback) {
    return client.get(key, function(err, value) {
      if (value === null) {
        handle.emit('miss', key);
      }

      callback(err, value);
    });
  };

  handle.del = function(key, callback) {
    client.del(key, callback);
  };

  handle.clear = function() {
    client.flushdb();
  };

  handle.size = function(callback) {
    client.dbsize(callback);
  };

  handle.dump = function(callback) {
    // ?
  };

  return handle;
};