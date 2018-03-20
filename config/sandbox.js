'use strict';

var path = require('path');

module.exports = {
  application: {
    enabled: true,
    errorEvent: {
      name: 'exception'
    },
    rpcMasters: {
      "feature_1": {
        uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
        exchangeName: 'stormeye-dispatcher-portal',
        routingKey: 'stormeye-dispatcher-feature-1',
        autoinit: false,
        applicationId: 'StormeyeDispatcherWs'
      },
      "feature_2": {
        uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
        exchangeName: 'stormeye-dispatcher-portal',
        routingKey: 'stormeye-dispatcher-feature-2',
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
