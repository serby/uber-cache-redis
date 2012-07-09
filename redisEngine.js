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
    var encoded;

    if (typeof ttl === 'function') {
      callback = ttl;
      ttl = undefined;
    }

    if (typeof key === 'undefined') {
      var err = new Error('Invalid key undefined');
      handle.emit('error', err);
      throw err;
    }

    try {
      encoded = JSON.stringify(value);
    } catch (err) {
      if (typeof callback === 'function') {
        callback(err);
      }
      return;
    }

    if ((typeof(ttl) === 'number') && (parseInt(ttl, 10) === ttl)) {
      client.setex(key, ttl, encoded, callback);
    } else {
      client.set(key, encoded, callback);
    }
  };

  handle.get = function(key, callback) {
    return client.get(key, function(err, encoded) {
      var value;

      if (err) {
        return callback(err);
      }

      if (encoded === null) {
        handle.emit('miss', key);
        return callback(err, undefined);
      }

      try {
        value = JSON.parse(encoded);
      } catch (err) {
        return callback(err);
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