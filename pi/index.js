var raspi = require('raspi');
var I2C = require('raspi-i2c').I2C;
var servoDriver = require('./servo-driver');
var radio = require('./radio');
var servoChannel;

function ready() {
    servoChannel = 0;
    console.log('Ready');
    servoDriver.setServoPulse(servoChannel, 1500);
}

function onData(data) {
    console.log('message received:', data);
    var number = Number(data);
    if (number < 20) {
        servoChannel = data;
    } else {
        servoDriver.setServoPulse(servoChannel, number);
    }
}

raspi.init(() => {
    var i2c = new I2C();
    servoDriver.init(i2c);
    servoDriver.setPWMFrequency(60);
    radio.init(onData, ready);
});