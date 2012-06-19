var _ = require('underscore')
  , redis = require('redis');

module.exports = function(options) {

  var client = redis.createClient();

  client.on('error', function (err) {
    console.log('Redis Error: ' + err);
  });

  options = _.extend({
    size: 1000 // Maximum number of items that can be held in the LRU cache.
  }, options);

  function clear() {
    client.flushdb();
  }

  function del(key, callback) {
    client.del(key, callback);
  }

  return {
    set: function(key, value, ttl, callback) {
      if (typeof ttl === 'function') {
        callback = ttl;
        ttl = undefined;
      }
      if (typeof key === 'undefined') {
        throw new Error('Invalid key undefined');
      }
      if ((typeof(ttl) === 'number') && (parseInt(ttl, 10) === ttl)) {
        client.setex(key, ttl, value, callback);
      } else {
        client.set(key, value, callback);
      }
    },
    get: function(key, callback) {
      return client.get(key, callback);
    },
    del: del,
    clear: clear,
    size: function(callback) {
      client.dbsize(callback);
    },
    dump: function() {
      //?
    }
  };
};