var gpio = require('./gpio');

const clockPin = 18,
    misoPin = 23,
    mosiPin = 24,
    csPin = 25;

function init(callback) {
    gpio.open([clockPin, misoPin, mosiPin, csPin], callback);
}

function readadc(channel) {
    gpio.write({
        [csPin]: 1,
        [clockPin]: 0,
        [csPin]: 0
    }, () => {
         
    });
}