var _ = require('underscore')
  ;

require('uber-cache/test/engine')('redisCacheEngine', function(options) {

  var engine = require('../')(options);

  options = _.extend({
    gcInterval: 100
  }, options);

  engine.clear();
  return engine;

});