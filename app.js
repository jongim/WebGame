var sys = require('sys'),
    http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server); 

server.listen(13000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('Hello World');
});

//app.listen(13000);

//var socket = io.listen(app); 

io.sockets.on('connection', function (client){ 
  // new client is here!
  setTimeout(function () {
        client.send('Waited two seconds!');
    }, 2000);

  client.on('message', function () {
  }) ;

  client.on('disconnect', function () {
  });
});