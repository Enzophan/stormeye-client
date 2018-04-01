module.exports = {
  "fibonacci": {
    rpcName: 'fibonacci',
    routineId: 'fibonacci',
    transformRequest: function(data) {
      return data;
    },
    replyTo: "fibonacci"
  },
  "method1": {
    serviceName: "stormeye-worker-node1/features",
    methodName: "method1",
    transformRequest: function(data) {
      return data;
    },
    transformResponse: function(data) {
      return data;
    },
    replyTo: "method1"
  },
  "method2": {
    serviceName: "stormeye-worker-node1/features",
    methodName: "method2"
  },
  "method3": {
    serviceName: "stormeye-worker-node1/features",
    methodName: "method3"
  },
  "method7": {
    serviceName: "stormeye-worker-node2/features",
    methodName: "method7"
  },
  "method8": {
    serviceName: "stormeye-worker-node2/features",
    methodName: "method8"
  },
  "method9": {
    serviceName: "stormeye-worker-node2/features",
    methodName: "method9"
  }
}