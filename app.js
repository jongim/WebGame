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

io.sockets.on('connection', function (socket) {
    // new client is here!
    console.log('Connection');

    socket.on('btn', function(data) {
        console.log("btn : " + data);
        io.sockets.emit('btn', data);

    });

    socket.on('pad', function(data, flag) {
        console.log("pad : " + data + flag);
        io.sockets.emit('pad', data, flag);

    });

    socket.on('disconnection', function() {
        console.log('disconnection');
    })
});