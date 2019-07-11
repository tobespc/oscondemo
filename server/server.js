
require('appmetrics-dash').attach();
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();
const appName = require('./../package').name;
const http = require('http');
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');


const logger = log4js.getLogger(appName);
logger.level = process.env.LOG_LEVEL || 'error'
const app = express();
const server = http.createServer(app);

app.use(log4js.connectLogger(logger, { level: logger.level }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app, server);
const utils = require('./utils');

// Add your code here
monitoring.on('initialized', function (env) {
  env = monitoring.getEnvironment();
  for (var entry in env) {
      console.log(entry + ':' + env[entry]);
  };
});




monitoring.on('http', async function (http) {

  console.log('[' + new Date(http.time) + '] duration : ' + http.duration);
  var valueToSend;
  if (http.duration > 10 && http.duration < 20 ) {
    valueToSend=1;
  }

   const options = {
      hostname: 'www.bbc.co.uk',
      port: 80,
      path: '/',
      //path: encodeURI("/pigo/" + valueToSend),
      method: 'POST',
      timeout: 1000
    }
 
  const response = await utils.asyncHttpRequest(options, null, this.secure);
  switch (response.statusCode){
    case 200:
      console.log('ok');
      break;
    default:
      console.error('error');
      break;
  }
});

const port = process.env.PORT || localConfig.port;
server.listen(port, function(){
  logger.info(`node listening on http://localhost:${port}/appmetrics-dash`);
  logger.info(`node listening on http://localhost:${port}`);
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
	res.sendFile(path.join(__dirname, '../public', '500.html'));
});

module.exports = server;