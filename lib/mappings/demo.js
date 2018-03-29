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
    routineId: "feature1",
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
    routineId: "feature2"
  },
  "method3": {
    rpcName: "feature1",
    routineId: "feature3"
  }
}