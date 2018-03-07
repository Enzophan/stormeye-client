'use strict';

var Devebot = require('devebot');
var lodash = Devebot.require('lodash');

var Service = function(params) {
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
    LX.has('debug') && LX.log('debug', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Example receives an event[${eventName}]: ${eventData}'
    }));
    next();
  }

  params.websocketTrigger.addInterceptor('opflow', opflowForwarder);
}

Service.referenceList = [ "websocketTrigger" ]

module.exports = Service;
