'use strict';

var Devebot = require('devebot');
var Promise = Devebot.require('bluebird');
var lodash = Devebot.require('lodash');
var opflow = require('opflow');

var Service = function(params) {
  params = params || {};
  var self = this;

  var LX = params.loggingFactory.getLogger();
  var LT = params.loggingFactory.getTracer();

  LX.has('silly') && LX.log('silly', LT.toMessage({
    tags: [ 'constructor-begin' ],
    text: ' + constructor begin ...'
  }));

  var pluginCfg = lodash.get(params, ['sandboxConfig'], {});

  var _publishers = {};
  lodash.forOwn(pluginCfg.publishers, function(pubInfo, pubName) {
    if (lodash.isObject(pubInfo) && !lodash.isEmpty(pubInfo) && pubInfo.enabled != false) {
      _publishers[pubName] = new opflow.PubsubHandler(pubInfo);
    }
  });

  Object.defineProperty(self, 'publishers', {
    get: function() { return _publishers },
    set: function(val) {}
  });

  self.start = function() {
    return Promise.mapSeries(lodash.values(_publishers), function(publisher) {
      return publisher.ready();
    });
  };

  self.stop = function() {
    return Promise.mapSeries(lodash.values(_publishers), function(publisher) {
      return publisher.close();
    });
  };

  LX.has('silly') && LX.log('silly', LT.toMessage({
    tags: [ 'constructor-end' ],
    text: ' - constructor end!'
  }));
};

module.exports = Service;
