'use strict';

var Devebot = require('devebot');
var lodash = Devebot.require('lodash');

var Service = function(params) {
  var LX = params.loggingFactory.getLogger();
  var LT = params.loggingFactory.getTracer();
  params.websocketTrigger.addInterceptor('opflow', function(eventName, eventData, next) {
    LX.has('debug') && LX.log('debug', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Example receives an event[${eventName}]: ${eventData}'
    }));
    next();
  });
}

Service.referenceList = [ "websocketTrigger" ]

module.exports = Service;
