
var fs = require('fs');
var http = require('http');
var marked = require('marked');
var express = require('express');
var socketio = require('socket.io');

var app = express();
app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
var io = socketio(server);

io.on('connection', function(socket) {
    socket.on('move', function(data) {
        socket.broadcast.emit('move', data);    
    });
});

server.listen(app.get('port'));


