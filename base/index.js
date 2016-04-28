var SerialPort = require('serialport').SerialPort,
    port = 'COM3',
    baudrate = 57600;

var MAIN_SAIL = 1,
    AFT_SAIL = 2,
    RUDDER = 3;

var PULSE = {
    STOP: 1500,
    CLOCKWISE: 1550,
    COUNTER_CLOCKWISE: 1450
};

var rudderPosition = 90;

var serialPort = new SerialPort(port, {
    baudrate: baudrate
});

serialPort.on('open', function () {
    console.log('Ready');

    function sendMessage(channel, pulse) {
        var data = {
            channel: channel,
            pulse: pulse
        };
        serialPort.write(JSON.stringify(data) + '\n');
    }

    var controller = require('./controller');

    controller.init();

    controller.on('RIGHT_STICK:left', function () {
        console.log('right stick left');
        sendMessage(AFT_SAIL, PULSE.COUNTER_CLOCKWISE);
    });

    controller.on('RIGHT_STICK:right', function () {
        console.log('right stick right');
        sendMessage(AFT_SAIL, PULSE.CLOCKWISE);
    });

    controller.on('RIGHT_STICK:release', function () {
        console.log('right stick release');
        sendMessage(AFT_SAIL, PULSE.STOP);
    });

    controller.on('LEFT_TRIGGER', function () {
        console.log('left trigger');
        rudderPosition += 10;
        sendMessage(RUDDER, rudderPosition);
    });

    controller.on('RIGHT_TRIGGER', function () {
        console.log('right trigger');
        rudderPosition -= 10;
        sendMessage(RUDDER, rudderPosition);
    });
    
    controller.on('LEFT_STICK:left', function () {
        console.log('left stick left');
        sendMessage(MAIN_SAIL, PULSE.COUNTER_CLOCKWISE);
    });

    controller.on('LEFT_STICK:right', function () {
        console.log('left stick right');
        sendMessage(MAIN_SAIL, PULSE.CLOCKWISE);
    });

    controller.on('LEFT_STICK:release', function () {
        console.log('left stick release');
        sendMessage(MAIN_SAIL, PULSE.STOP);
    });
});


