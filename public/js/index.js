var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
    socket.emit('createMessage', {
        text: 'this is fantastic !',
        from: 'Kathan'
    });
});
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (newMessage) {
    console.log('New message recieved', newMessage);
});