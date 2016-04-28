var raspi = require('raspi');
var I2C = require('raspi-i2c').I2C;
var servoDriver = require('./servo-driver');
var radio = require('./radio');

var MAIN_SAIL = 1,
    AFT_SAIL = 2,
    RUDDER = 3;

var servoChannel;

function ready() {
    console.log('Ready');
    servoDriver.setServoPulse(MAIN_SAIL, 1500);
    servoDriver.setServoPulse(AFT_SAIL, 1500);
}

function onData(message) {
    var object = JSON.parse(message);
    servoDriver.setServoPulse(object.channel, object.pulse);
}

raspi.init(() => {
    var i2c = new I2C();
    servoDriver.init(i2c);
    servoDriver.setPWMFrequency(60);
    radio.init(onData, ready);
});