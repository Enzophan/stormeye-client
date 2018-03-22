'use strict';

var Devebot = require('devebot');
var chores = Devebot.require('chores');
var lodash = Devebot.require('lodash');

var Service = function(params) {
  params = params || {};
  var packageName = params.packageName || 'dispatcher-ws';
  var blockRef = chores.getBlockRef(__filename, packageName);

  var counselor = params.counselor;
  var appCfg = lodash.get(params, 'sandboxConfig', {});
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
  var forwarderInterceptor = function(eventName, eventData, next) {
    var LT = this.tracer;
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Forwarder receives an event[${eventName}]: ${eventData}'
    }));
    if (counselor.has(eventName)) {
      // do something here
    } else {
      next();
    }
  }

  var unmatchedInterceptor = function(eventName, eventData, next) {
    var errorEvent = lodash.get(appCfg, ['errorEvent', 'name'], null);
    if (errorEvent) {
      LX.has('silly') && LX.log('silly', LT.add({
        eventName: eventName,
        eventData: eventData,
        errorEvent: errorEvent
      }).toMessage({
        tags: [ blockRef, 'unmatchedInterceptor' ],
        text: 'event[${eventName}] is reflected to ${errorEvent}'
      }));
      this.socket.emit(errorEvent, {name: eventName, data: eventData});
    } else {
      LX.has('error') && LX.log('error', LT.add({
        eventName: eventName,
        eventData: eventData,
        reason: 'not-found'
      }).toMessage({
        tags: [ blockRef, 'unmatchedInterceptor' ],
        text: 'event[${eventName}] with data: ${eventData} is unmatched'
      }))
    }
  }

  if (isTestingEnv()) {
    params.websocketTrigger.addInterceptor('__begin__', function(eventName, eventData, next) {
      LX.has('conlog') && LX.log('conlog', lodash.pad(this.socket.id, 70, '-'));
      next();
    });
  }

  params.websocketTrigger.addInterceptor('forwarder', forwarderInterceptor);

  if (isTestingEnv()) {
    params.websocketTrigger.addInterceptor('___end___', function(eventName, eventData, next) {
      LX.has('silly') && LX.log('silly', LT.add({
        eventName: eventName,
        eventData: eventData
      }).toMessage({
        tags: [ blockRef, 'echoInterceptor' ],
        text: 'ping/pong the event[${eventName}] with data: ${eventData}'
      }));
      this.socket.emit(eventName, eventData);
      LX.has('conlog') && LX.log('conlog', lodash.repeat('-', 70));
    });
  }

  params.websocketTrigger.addInterceptor('exception', unmatchedInterceptor);
}

Service.referenceList = [ "broker", "counselor", "websocketTrigger" ]

module.exports = Service;

var isTestingEnv = function() {
  return process.env.NODE_ENV === 'test';
}
