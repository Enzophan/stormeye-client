'use strict';

var path = require('path');

module.exports = {
  application: {
    enabled: true,
    specialEvents: {
      error: {
        name: 'ERROR'
      },
      failed: {
        name: 'ERROR'
      },
      invalid: {
        name: 'ERROR'
      },
      timeout: {
        name: 'TIMEOUT'
      }
    },
    rpcMasters: {
      "fibonacci": {
        uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
        exchangeName: 'stormeye-dispatcher-portal',
        routingKey: 'stormeye-dispatcher-fibonacci',
        autoinit: false,
        applicationId: 'StormeyeDispatcherWs'
      },
      "feature1": {
        uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
        exchangeName: 'stormeye-dispatcher-portal',
        routingKey: 'stormeye-dispatcher-feature1',
        autoinit: false,
        applicationId: 'StormeyeDispatcherWs'
      },
      "feature2": {
        uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
        exchangeName: 'stormeye-dispatcher-portal',
        routingKey: 'stormeye-dispatcher-feature2',
        autoinit: false,
        applicationId: 'StormeyeDispatcherWs'
      }
    },
    mappingStore: path.join(__dirname, '../lib/mappings/demo'),
  },
  plugins: {
    appWebsocket: {
    },
    appWebserver: {
      host: '0.0.0.0',
      port: 7878,
      verbose: true
    }
  }
};
