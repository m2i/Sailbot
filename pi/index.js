var raspi = require('raspi');
var I2C = require('raspi-i2c').I2C;
var servoDriver = require('./servo-driver');
var radio = require('./radio');
var servoChannel = 1;

function ready() {
    console.log('Ready');
    servoDriver.setServoPulse(servoChannel, 1500);
}

function onData(data) {
    console.log('message received:', data);
    servoDriver.setServoPulse(servoChannel, data);
}

raspi.init(() => {
    var i2c = new I2C();
    servoDriver.init(i2c);
    servoDriver.setPWMFrequency(60);
    radio.init(onData, ready);
});