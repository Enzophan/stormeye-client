'use strict';

var Devebot = require('devebot');
var chores = Devebot.require('chores');
var lodash = Devebot.require('lodash');

var Service = function(params) {
  params = params || {};
  var packageName = params.packageName || 'dispatcher-ws';
  var blockRef = chores.getBlockRef(__filename, packageName);

  var LX = params.loggingFactory.getLogger();
  var LT = params.loggingFactory.getTracer();

  var beginInterceptor = function(eventName, eventData, next) {
    LX.has('silly') && LX.log('silly', lodash.pad(this.socket.id, 70, '-'));
    next();
  }

  /**
   * The forwarder method that contains:
   *  - this.socket: the socket object
   *  - this.tracer: the tracer associated with socket
   *  - this.helper: the helper object that provides utility function,
   *    for example: getSocketById(), ...
   * 
   * @param {*} eventName name of received event
   * @param {*} eventData data in JSON
   * @param {*} next bypass the processing to the next interceptor
   */
  var opflowForwarder = function(eventName, eventData, next) {
    var LT = this.tracer;
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Forwarder receives an event[${eventName}]: ${eventData}'
    }));
    next();
  }

  var endLine = lodash.repeat('-', 60);
  var echoInterceptor = function(eventName, eventData, next) {
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      tags: [ blockRef, 'echoInterceptor' ],
      text: 'ping/pong the event[${eventName}] with data: ${eventData}'
    }));
    this.socket.emit(eventName, eventData);
    LX.has('silly') && LX.log('silly', endLine);
  }

  params.websocketTrigger.addInterceptor('__begin__', beginInterceptor);
  params.websocketTrigger.addInterceptor('opflow', opflowForwarder);
  params.websocketTrigger.addInterceptor('ping-pong', echoInterceptor);
}

Service.referenceList = [ "websocketTrigger" ]

module.exports = Service;
