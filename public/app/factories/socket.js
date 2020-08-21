angular.module('app')

.factory('Socket', function (socketFactory) {

  var socket = io('http://localhost:8000',{transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']});
  mySocket = socketFactory({ioSocket: socket});

  return mySocket;

});
