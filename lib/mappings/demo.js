module.exports = {
  "list": {
    requestTransform: function(data) {
      return data;
    },
    forwardTo: {
      publisher: 'feature_1',
      routineId: 'listAction'
    },
    responseTransform: function(data) {
      return data;
    },
    responseTo: "list"
  },
  "details": {
    forwardTo: {
      publisher: 'feature_1',
      routineId: 'detailsAction'
    }
  }
}