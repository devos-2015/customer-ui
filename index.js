var express = require('express');
var static  = require('express-static');

// get ServiceList from DiscoveryServer
var sdk = require('lc-sdk-node.js');

var client = sdk({ discoveryServers: [
  '46.101.245.190:8500',
  '46.101.132.55:8500',
  '46.101.193.82:8500'
]})

client.get('cart-service', '/cart/43759348759').then(function (resul){
  console.log(result);
})
//--------------------------------------------


// Define some default values if not set in environment
var PORT = process.env.PORT || 3000;
var SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
var SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

// Create a new express app
var app = express();

app.get(SERVICE_CHECK_HTTP, function(req, resp){
  resp.send({
    message: 'ok'
  })
});

app.use(static(__dirname + '/app'));

// Start the server
var server = app.listen(PORT);

console.log('Service listening on port %s ...', PORT);




////////////// GRACEFUL SHUTDOWN CODE ////

var gracefulShutdown = function () {
  console.log('Received kill signal, shutting down gracefully.');

  // First we try to stop the server smoothly
  server.close(function () {
    console.log('Closed out remaining connections.');
    process.exit();
  });

  // After SHUTDOWN_TIMEOUT we will forcefully kill the process in case it's still running
  setTimeout(function () {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit();
  }, SHUTDOWN_TIMEOUT);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);


