module.exports = {
  application: {
    enabled: true,
    errorEvent: {
      name: 'exception'
    }
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
