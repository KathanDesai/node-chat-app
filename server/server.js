const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

var app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

var server = http.createServer(app);

const port = process.env.PORT || 3000;

var io = socketIO(server);

var users = new Users();

io.on('connection', (socket) => {

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        callback();
    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('UserName and Room name are required');
        }
        if (users.isUserAlreadyPresent(params.name, params.room)) {
            return callback('This Username is already taken for this chat room');
        }
        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app !'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        io.to(params.room).emit('updateUsersList', users.getUserlist(params.room));
        callback();
    });

    socket.on('createLocationMessage', (location) => {
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, location));
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserlist(user.room));
            socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the chat`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});