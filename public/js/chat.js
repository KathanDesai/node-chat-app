var socket = io();
socket.on('connect', function () {
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (error) {
        if (error) {
            alert(error);
            window.location.href = '/';
        } else {

        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUsersList', function (users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

function scrollToBottom() {
    var messages = jQuery('#allMessages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('newMessage', function (newMessage) {
    var template = jQuery('#message-template').html();
    var formattedTime = moment(newMessage.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: newMessage.text,
        from: newMessage.from,
        time: formattedTime
    });
    jQuery('#allMessages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (newLocationMessage) {
    var template = jQuery('#location-message-template').html();
    var formattedTime = moment(newLocationMessage.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        url: newLocationMessage.url,
        from: newLocationMessage.from,
        time: formattedTime
    });
    jQuery('#allMessages').append(html);
    scrollToBottom();
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