'use strict';
module.exports = function(serverPort, defaultServer) {
  var o = { host : "localhost", port : 9000 }, 
    portPosition = String(serverPort).lastIndexOf(':'), 
    r = new RegExp('^[0-9]+$');
  if ( defaultServer && ('host' in defaultServer || 'port' in defaultServer)) {
    var key;
    for(key in defaultServer) {
      if(defaultServer.hasOwnProperty(key)) o[key] = defaultServer[key];
    }
  }
  if ( portPosition > -1) {
    if(portPosition == 0) {
      o.host =  "::"; 
    } else {
      o.host = serverPort.substr(0, portPosition); 
    }
    o.port = serverPort.substr(portPosition+1);
  } else if (r.test(serverPort)) {
    o.port = parseInt(serverPort);
  } else if (serverPort && String(serverPort).length > 0) {
    o.host = serverPort;
  }
  if(o.host == '*') o.host = '::';
  return o;
}