'use strict';

var async = require('async');
var Promise = require('bluebird');
var lodash = require('lodash');
var socketioClient = require('socket.io-client');

var TOTAL = 10000;

var openSocket = function(total) {
  total = total || TOTAL;
  var socket = socketioClient('http://127.0.0.1:7878', {
    timeout: 3600000,
    'force new connection': true,
    reconnect: false
  });

  var cards = lodash.map(lodash.range(total), function(idx) {
    return lodash.padStart(idx, 8, '0');
  });

  socket.on('connect', function() {
    var received = 0;
    socket.on('ERROR', function(info) {
      console.log('=== ERROR: %s', JSON.stringify(info));
      received++;
    });
    socket.on('TIMEOUT', function(info) {
      console.log('=== TIMEOUT: %s', JSON.stringify(info));
      received++;
    });
    ['method1', 'method2', 'method3'].forEach(function(methodId) {
      socket.on(methodId, function(info) {
        var actionId = info.actionId;
        console.log('Result of %s(%s): %s', methodId, actionId, JSON.stringify(info));
        received++;
        if (cards.length < 10) {
          console.log('Remain: %s', JSON.stringify(cards));
        }
        var actionIndex = cards.indexOf(actionId);
        if (actionIndex >= 0) cards.splice(actionIndex, 1);
        if (received >= total) {
          console.log('Completed: %s', JSON.stringify(cards));
          socket.close();
        }
      });
    });
    setTimeout(function() {
      for(var k=0; k<total; k++) {
        var item = { data: {} };
        item.name = 'method' + lodash.random(1, 3);
        item.data.number = lodash.random(10, 50);
        item.data.actionId = lodash.padStart(k, 8, '0');
        socket.emit(item.name, item.data);
      }
    }, 2000);
  });
}

openSocket();
