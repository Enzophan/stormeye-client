'use strict';

var Loadsync = require('loadsync');
var lodash = require('devebot').require('lodash');

var socket = require('socket.io-client')('http://127.0.0.1:7878', {
  'force new connection': true,
  reconnect: true
});

var demoData = [
  {
    name: 'method7',
    data: {
      number: 45
    }
  },
  {
    name: 'method8',
    data: {
      number: 46
    }
  },
  {
    name: 'method9',
    data: {
      number: 47
    }
  }
]

demoData = demoData.map(function(item, idx) {
  item.data.actionId = lodash.padStart(idx, 6, '0');
  return item;
});

var loadsync = new Loadsync([{
  name: 'NO_TIMEOUT',
  cards: lodash.map(demoData, function(item) {
    return item.data.actionId
  })
}]);

loadsync.ready(function(info) {
  socket.close();
}, 'NO_TIMEOUT');

socket.on('connect', function() {
  ['method7', 'method8', 'method9'].forEach(function(methodId) {
    socket.on(methodId, function(info) {
      var actionId = info.actionId;
      console.log('Result of %s(%s): %s', methodId, actionId, JSON.stringify(info, null, 2));
      loadsync.check(actionId, 'NO_TIMEOUT');
    });
  });
  lodash.forEach(demoData, function(descriptor) {
    socket.emit(descriptor.name, descriptor.data);
  });
});
