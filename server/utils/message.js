var moment = require('moment');
var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

var generateLocationMessage = (from, location) => {
    return {
        url: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: moment().valueOf(),
        from: from
    };
};

module.exports = { generateMessage, generateLocationMessage };