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
    rpcName: "feature1",
    routineId: "method1",
    transformRequest: function(data) {
      return data;
    },
    transformResponse: function(data) {
      return data;
    },
    replyTo: "method1"
  },
  "method2": {
    rpcName: "feature1",
    routineId: "method2",
    transformRequest: function(data) {
      return data;
    }
  },
  "method3": {
    rpcName: "feature1",
    routineId: "method3",
    transformRequest: function(data) {
      return data;
    }
  },
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