'use strict';

var Loadsync = require('loadsync');
var lodash = require('devebot').require('lodash');

var socket = require('socket.io-client')('http://127.0.0.1:7878', {
  'force new connection': true,
  reconnect: true
});

var demoData = {
  'action_34': {
    name: 'fibonacci',
    data: {
      number: 34
    }
  },
  'action_35': {
    name: 'fibonacci',
    data: {
      number: 35
    }
  },
  'action_50': {
    name: 'fibonacci',
    data: {
      number: 50
    }
  }
}

var loadsync = new Loadsync([{
  name: 'NO_TIMEOUT',
  cards: lodash.keys(demoData)
}]);

loadsync.ready(function(info) {
  socket.close();
}, 'NO_TIMEOUT');

socket.on('connect', function() {
  socket.on('fibonacci', function(info) {
    var action = 'action_' + info.number;
    console.log('Result of %s: %s', action, JSON.stringify(info, null, 2));
    loadsync.check(action, 'NO_TIMEOUT');
  });
  lodash.forOwn(demoData, function(descriptor, action) {
    socket.emit(descriptor.name, descriptor.data);
  });
});
