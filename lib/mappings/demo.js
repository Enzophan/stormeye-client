module.exports = {
  "fibonacci": {
    rpcName: 'fibonacci',
    routineId: 'fibonacci',
    transformRequest: function(data) {
      return { number: data.number }
    },
    replyTo: "fibonacci"
  },
  "list": {
    rpcName: 'feature_1',
    routineId: 'listAction',
    transformRequest: function(data) {
      return data;
    },
    transformResponse: function(data) {
      return data;
    },
    replyTo: "list"
  },
  "details": {
    rpcName: 'feature_1',
    routineId: 'detailsAction'
  }
}