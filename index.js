'use strict';

var app = require('devebot').launchApplication({
  appRootPath: __dirname
}, [
  'app-websocket'
]);

if (require.main === module) app.server.start();

module.exports = app;
