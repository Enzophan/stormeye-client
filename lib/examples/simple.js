'use strict';

var socket = require('socket.io-client')('http://127.0.0.1:7878', {
  'force new connection': true,
  reconnect: true
});

socket.on('connect', function() {
  socket.on('method1', function(info) {
    var actionId = info.actionId;
    console.log('Result of %s: %s', actionId, JSON.stringify(info, null, 2));
    socket.close();
  });
  socket.emit('method1', {
    number: 50,
    actionId: '000005'
  });
});
