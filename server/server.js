const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');


var app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

var server = http.createServer(app);

const port = process.env.PORT || 3000;

var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});