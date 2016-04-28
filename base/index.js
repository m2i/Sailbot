var SerialPort = require('serialport').SerialPort,
    port = 'COM3',
    baudrate = 57600;

var MAIN_SAIL = 1,
    AFT_SAIL = 2,
    RUDDER = 3;

var PULSE = {
    STOP: 1500,
    CLOCKWISE: 1600,
    COUNTER_CLOCKWISE: 1400
};

var rudderPosition = 1600; // basically the middle

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
        sendMessage(MAIN_SAIL, PULSE.COUNTER_CLOCKWISE);
    });

    controller.on('RIGHT_STICK:right', function () {
        sendMessage(MAIN_SAIL, PULSE.CLOCKWISE);
    });

    controller.on('RIGHT_STICK:release', function () {
        sendMessage(MAIN_SAIL, PULSE.STOP);
    });

    controller.on('LEFT_TRIGGER', function () {
        if (rudderPosition < 2200) {
            rudderPosition += 100;
            console.log('rudderPosition', rudderPosition);
            sendMessage(RUDDER, rudderPosition);
        }
    });

    controller.on('RIGHT_TRIGGER', function () {
        if (rudderPosition > 700) {
            rudderPosition -= 100;
            console.log('rudderPosition', rudderPosition);
            sendMessage(RUDDER, rudderPosition);
        }
    });

    controller.on('LEFT_STICK:left', function () {
        sendMessage(AFT_SAIL, PULSE.COUNTER_CLOCKWISE);
    });

    controller.on('LEFT_STICK:right', function () {
        sendMessage(AFT_SAIL, PULSE.CLOCKWISE);
    });

    controller.on('LEFT_STICK:release', function () {
        sendMessage(AFT_SAIL, PULSE.STOP);
    });
});


