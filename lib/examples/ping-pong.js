'use strict';

var Loadsync = require('loadsync');
var lodash = require('devebot').require('lodash');

var socket = require('socket.io-client')('http://127.0.0.1:7878', {
  'force new connection': true,
  reconnect: true
});

var demoData = {
  'action_1': {
    number: 1024
  },
  'action_2': {
    pi: 3.14159
  },
  'action_3': {
    data: {
      HOST: '0.0.0.0',
      PORT: 8080
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
  lodash.forOwn(demoData, function(data, action) {
    socket.on(action, function(info) {
      console.log('Result of %s: %s', action, JSON.stringify(info, null, 2));
      loadsync.check(action, 'NO_TIMEOUT');
    });
    socket.emit(action, data);
  });
});
