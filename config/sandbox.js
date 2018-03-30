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
      }
    },
    mappingStore: path.join(__dirname, '../lib/mappings/demo'),
  },
  plugins: {
    appOpmaster: {
      mappings: {
        "stormeye-worker-node1/features": {
          "method1": {
            rpcName: "feature1",
            routineId: "routine1"
          },
          "method2": {
            rpcName: "feature1",
            routineId: "routine2"
          },
          "method3": {
            rpcName: "feature1",
            routineId: "routine3"
          }
        },
        "stormeye-worker-node2/features": {
          "method7": {
            rpcName: "feature2",
            routineId: "method7"
          },
          "method8": {
            rpcName: "feature2",
            routineId: "method8"
          },
          "method9": {
            rpcName: "feature2",
            routineId: "method9"
          }
        }
      },
      rpcMasters: {
        "feature1": {
          uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
          exchangeName: 'stormeye-dispatcher-portal',
          routingKey: 'stormeye-dispatcher-feature1',
          autoinit: false,
          applicationId: 'StormeyeDispatcherWs',
          monitorTimeout: 20000
        },
        "feature2": {
          uri: process.env.STORMEYE_OPFLOW_URI || process.env.DEVEBOT_OPFLOW_URI || 'amqp://localhost',
          exchangeName: 'stormeye-dispatcher-portal',
          routingKey: 'stormeye-dispatcher-feature2',
          autoinit: false,
          applicationId: 'StormeyeDispatcherWs',
          monitorTimeout: 20000
        }
      }
    },
    appWebsocket: {
    },
    appWebserver: {
      host: '0.0.0.0',
      port: 7878,
      verbose: true
    }
  }
};
