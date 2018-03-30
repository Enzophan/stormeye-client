'use strict';

var Devebot = require('devebot');
var chores = Devebot.require('chores');
var lodash = Devebot.require('lodash');

var Service = function(params) {
  params = params || {};
  var packageName = params.packageName || 'dispatcher-ws';
  var blockRef = chores.getBlockRef(__filename, packageName);

  var counselor = params.counselor;
  var pluginCfg = lodash.get(params, 'sandboxConfig', {});
  var LX = params.loggingFactory.getLogger();
  var LT = params.loggingFactory.getTracer();

  var rpcMasters = params.broker.rpcMasters;

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
    var that = this;
    var LT = this.tracer;
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Forwarder receives an event[${eventName}]: ${eventData}'
    }));
    if (counselor.has(eventName)) {
      var requestId = chores.getUUID();
      var reqTR = LT.branch({ key: 'requestId', value: requestId });
      var mapping = counselor.get(eventName);
      var rpcPayload = mapping.transformRequest ? mapping.transformRequest(eventData) : eventData;
      if (rpcMasters[mapping.rpcName]) {
        return rpcMasters[mapping.rpcName].request(mapping.routineId, rpcPayload, {
          timeout: pluginCfg.opflowTimeout,
          requestId: requestId
        }).then(function(task) {
          return task.extractResult();
        }).then(function(result) {
          LX.isEnabledFor('info') && LX.log('info', reqTR.add({
            message: 'RPC result',
            resultStatus: result.status
          }).toMessage({reset: true}));
          switch(result.status) {
            case 'timeout':
              var ename = lodash.get(pluginCfg, ['specialEvents', 'timeout', 'name'], 'TIMEOUT');
              that.socket.emit(ename, {
                status: result.status,
                message: 'Service request has been timeout'
              });
              return true;
            case 'failed':
              var ename = lodash.get(pluginCfg, ['specialEvents', 'failed', 'name'], 'FAILED');
              that.socket.emit(ename, {
                status: result.status,
                message: 'Service request has been failed'
              });
              return true;
            case 'completed':
              var replyTo = mapping.replyTo || eventName;
              that.socket.emit(replyTo, result.value);
              return true;
          }
          LX.has('error') && LX.log('error', reqTR.toMessage({
            text: 'RPC status not found'
          }));
          var ename = lodash.get(pluginCfg, ['specialEvents', 'invalid', 'name'], 'EXCEPTION');
          that.socket.emit(ename, {
            status: result.status,
            message: 'Service request returns unknown status'
          });
          return false;
        });
      }
    }
    next();
  }

  var lookupService = function(serviceName) {
    var ref = {};
    var commander = params.sandboxRegistry.lookupService("app-opmaster/commander");
    if (commander) {
      ref.isRemote = true;
      ref.service = commander.lookupService(serviceName);
      if (!ref.service) {
        ref.isRemote = false;
        ref.service = params.sandboxRegistry.lookupService(serviceName);
      }
    }
    return ref;
  }

  var feature1Ref = lookupService("stormeye-worker-node1/features");

  var commanderInterceptor = function(eventName, eventData, next) {
    var that = this;
    var LT = this.tracer;
    LX.has('silly') && LX.log('silly', LT.add({
      eventName: eventName,
      eventData: eventData
    }).toMessage({
      text: 'Forwarder receives an event[${eventName}]: ${eventData}'
    }));

    if (counselor.has(eventName)) {
      var requestId = chores.getUUID();
      var reqTR = LT.branch({ key: 'requestId', value: requestId });
      var mapping = counselor.get(eventName);
      var rpcData = mapping.transformRequest ? mapping.transformRequest(eventData) : eventData;
      if (feature1Ref.service && lodash.isFunction(feature1Ref.service[mapping.routineId])) {
        var promize;
        if (feature1Ref.isRemote) {
          promize = feature1Ref.service[mapping.routineId]([ rpcData ], {
            timeout: pluginCfg.opflowTimeout,
            requestId: requestId
          });
        } else {
          promize = Promise.resolve().then(function() {
            return feature1Ref.service[mapping.routineId](rpcData);
          });
        }
        return promize.then(function(result) {
          var replyTo = mapping.replyTo || eventName;
          that.socket.emit(replyTo, result);
          return true;
        }).catch(function(error) {
          var ename = lodash.get(pluginCfg, ['specialEvents', 'failed', 'name'], 'FAILED');
          that.socket.emit(ename, {
            status: -1,
            message: 'Service request has been failed',
            error: error
          });
          return true;
        });
      }
    }
    next();
  }

  var unmatchedInterceptor = function(eventName, eventData, next) {
    var errorEvent = lodash.get(pluginCfg, ['specialEvents', 'unmatched', 'name'], null);
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
  params.websocketTrigger.addInterceptor('commander', commanderInterceptor);

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

Service.referenceList = [ "broker", "counselor", "sandboxRegistry", "websocketTrigger" ];

module.exports = Service;

var isTestingEnv = function() {
  return process.env.NODE_ENV === 'test';
}
