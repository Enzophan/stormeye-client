'use strict';

var Devebot = require('devebot');
var chores = Devebot.require('chores');
var lodash = Devebot.require('lodash');

var Service = function(params) {
  params = params || {};
  var packageName = params.packageName || 'dispatcher-ws';
  var blockRef = chores.getBlockRef(__filename, packageName);

  var mappings = require('../mappings/demo');

  this.has = function(eventName) {
    return lodash.isObject(mappings[eventName]);
  }

  this.get = function(eventName) {
    return mappings[eventName];
  }
}

module.exports = Service;
