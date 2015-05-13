var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

var webPass = "oats";

var connectionTypes = {
  Web: 0,
  Robot: 1,
}

var robotSocket;
var controlSocket;
var controlSockets = [];
var robotConnected = false;

var lastTelemetry;

function unixTimeMS() {
  return Math.floor(Date.now());
}

function broadcastType(type, message, data) {
  controlSockets.forEach(function(socket) {
    if (socket.type == type)
      socket.emit(message, data);
  });
}

function checkRobotConnection() {
  if (lastTelemetry + 7000 > new Date().getTime()) {
    robotConnected = true;
    broadcastType(connectionTypes.Web, 'robotConnected', true);
  } else {
    robotConnected = false;
    broadcastType(connectionTypes.Web, 'robotConnected', false);
  }
  setTimeout(checkRobotConnection, 2600);
}
checkRobotConnection();

io.on('connection', function (socket) {
  socket.on('identify', function (type, password) {
    socket.type = type;
    if (type == connectionTypes.Web) {
        socket.emit('authSuccess');
        socket.authenticated = true;
        socket.isRobot = false;
        
        controlSocket = socket;

        controlSockets.push(socket);
        if (robotConnected)
          broadcastType(connectionTypes.Web, 'robotConnected', true);
          
        if (password == "oats") {
          console.log("Control socket authenticated");
          socket.authed = true;
        }
        
        socket.on('controlData', function(data) {
          if (socket.authed) {
            data['timestamp'] = unixTimeMS();
            robotSocket.emit('controlData', data);
            console.log(data);
          } 
        });
    } else if (type == connectionTypes.Robot) {
      console.log('Robot connected to CnC server!');
      socket.emit('robotConnected', true);
      robotConnected = true;
      if (controlSocket)
        broadcastType(connectionTypes.Web, 'robotConnected', true);
      socket.isRobot = true;
      robotSocket = socket;
      robotSocket.on('close', function() {
        broadcastType(connectionTypes.Web, 'robotConnected', false);
        robotConnected = false;
      });
    }
  });
  
  socket.on('robotIps', function(ips) {
    console.log(ips);
    broadcastType(connectionTypes.Web, 'robotIps', ips);
  });
  
  socket.on('telemetry', function(robot) {
    console.log(robot);
    lastTelemetry = new Date().getTime();
    if (controlSocket)
      broadcastType(connectionTypes.Web, 'robotTelemetry', robot);
  });
  
  socket.on('robotArmed', function(armed) {
    if (controlSocket)
      broadcastType(connectionTypes.Web, 'robotArmed', armed);
  });
  
  socket.on('wifiStatus', function(data) {
    if (controlSocket)
      broadcastType(connectionTypes.Web, 'wifiStatus', data);
  });
});

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Web CnC server online. Waiting for connections...");
});