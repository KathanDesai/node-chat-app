var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (newMessage) {
    var li = jQuery('<li></li>');
    li.text(`${newMessage.from} on ${newMessage.createdAt}: ${newMessage.text}`);
    jQuery("#allMessages").append(li);
});

socket.on('newLocationMessage', function (newLocationMessage) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>')
    a.attr('href', newLocationMessage.url);
    li.text(`${newLocationMessage.from} on ${newLocationMessage.createdAt}: `);
    li.append(a);
    jQuery("#allMessages").append(li);
});

jQuery("#message-form").on('submit', function (e) {
    e.preventDefault();
    var messageCont = jQuery("input[name='message']");
    socket.emit("createMessage", {
        from: 'User',
        text: messageCont.val()
    }, function () {
        messageCont.val('');
    });
});

var locationbtn = jQuery('#send-location');
locationbtn.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationbtn.attr('disabled', 'disabled').text('Sending location..');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationbtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            from: 'User',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationbtn.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});