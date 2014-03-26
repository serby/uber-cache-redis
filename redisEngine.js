var _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    noop = function() {},
    redis = require('redis');

module.exports = function(options) {

  var client = redis.createClient(),
      handle = new EventEmitter();

  client.on('error', function(err) {
    handle.emit('error', err);
  });

  handle.uberCacheVersion = '1';
  handle.staleDisabled = true;

  handle.set = function(key, value, ttl, callback) {
    var encoded;

    if (typeof ttl === 'function') {
      callback = ttl;
      ttl = undefined;
    }

    if (typeof key === 'undefined') {
      var err = new Error('Invalid key undefined');
      if (typeof callback === 'function') {
        callback(err);
      }
      return;
    }

    try {
      encoded = JSON.stringify(value);
    } catch (e) {
      if (typeof callback === 'function') {
        callback(e);
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
        callback(err);
        handle.emit('miss', key);
        return;
      }

      try {
        value = JSON.parse(encoded);
      } catch (e) {
        callback(e);
        return;
      }

      callback(err, value);
    });
  };

  handle.del = function(key, callback) {
    client.del(key, callback);
  };

  handle.clear = function(callback) {
    client.flushdb(callback);
  };

  handle.size = function(callback) {
    client.dbsize(callback);
  };

  handle.dump = function(callback) {
    // ?
  };

  return handle;
};