module.exports = {
  "list": {
    rpc: 'feature_1',
    routineId: 'listAction',
    requestTransform: function(data) {
      return data;
    },
    responseTransform: function(data) {
      return data;
    },
    responseTo: "list"
  },
  "details": {
    rpc: 'feature_1',
    routineId: 'detailsAction'
  }
}