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

  var echoInterceptor = function(eventName, eventData, next) {
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      tags: [ blockRef, 'echoInterceptor' ],
      text: 'ping/pong the event[${eventName}] with data: ${eventData}'
    }));
    this.socket.emit(eventName, eventData);
  }

  params.websocketTrigger.addInterceptor('opflow', opflowForwarder);
  params.websocketTrigger.addInterceptor('ping-pong', echoInterceptor);
}

Service.referenceList = [ "websocketTrigger" ]

module.exports = Service;
