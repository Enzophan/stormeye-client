'use strict';

var Devebot = require('devebot');
var lodash = Devebot.require('lodash');
var debugx = Devebot.require('pinbug')('fibonacci:rpc:worker');
var opflow = require('opflow');
var Fibonacci = require('./fibonacci');

var FibonacciRpcWorker = function(params, configurer) {
  var rpcWorker = new opflow.RpcWorker(params);
  var self = this;

  this.ready = rpcWorker.ready.bind(rpcWorker);

  this.process = function() {
    return rpcWorker.process('fibonacci', function(body, headers, response) {
      var requestId = headers.requestId;

      debugx.enabled && debugx('Request[%s] is a "%s", with body: %s', requestId, 
        headers.routineId, body);
      response.emitStarted();
      
      body = JSON.parse(body);

      debugx.enabled && debugx('Request[%s] - numberMax: %s', requestId, self.getNumberMax());
      if (self.isSettingAvailable() && self.getNumberMax() < body.number) {
        response.emitFailed({
          message: 'Number exceeding limit',
          numberMax: self.getNumberMax()
        });
        return;
      }

      var fibonacci = new Fibonacci(body);
      while(fibonacci.next()) {
        var r = fibonacci.result();
        debugx.enabled && debugx('Request[%s] step[%s]', requestId, r.step);
        response.emitProgress(r.step, r.number);
      };

      var result = fibonacci.result();
      result.actionId = body.actionId;
      debugx.enabled && debugx('Request[%s] has been finished: %s', requestId,
        JSON.stringify(result));
      response.emitCompleted(result);
    })
  }

  this.isSettingAvailable = function() {
    return lodash.isNumber(this.getNumberMax());
  }

  this.getNumberMax = function() {
    return 51;
  }

  this.close = rpcWorker.close.bind(rpcWorker);
}

module.exports = FibonacciRpcWorker;

if (require.main === module) {
  console.log('[+] FibonacciRpcWorker example');

  var worker = new FibonacciRpcWorker({
    uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
    exchangeName: 'stormeye-dispatcher-portal',
    routingKey: 'stormeye-dispatcher-fibonacci',
    operatorName: 'stormeye-worker-fibonacci-operator',
    responseName: 'stormeye-worker-fibonacci-response',
    applicationId: 'StormeyeDispatcherWs'
  });

  worker.ready().then(worker.process);
}
