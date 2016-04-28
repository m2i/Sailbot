var SerialPort = require('serialport').SerialPort,
    port = 'COM3',
    baudrate = 57600;

var MAIN_SAIL = 1,
    AFT_SAIL = 2;

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
        sendMessage(AFT_SAIL, 1450);
    });

    controller.on('RIGHT_STICK:right', function () {
        console.log('right stick right');
        sendMessage(AFT_SAIL, 1550);
    });

    controller.on('RIGHT_STICK:reset', function () {
        console.log('right stick reset');
        sendMessage(AFT_SAIL, 1500);
    });

    controller.on('LEFT_TRIGGER', function () {
        console.log('left trigger');
        sendMessage(MAIN_SAIL, 1450);
    });

    controller.on('LEFT_TRIGGER:reset', function () {
        console.log('left trigger reset');
        sendMessage(MAIN_SAIL, 1500);
    });

    controller.on('RIGHT_TRIGGER', function () {
        console.log('right trigger');
        sendMessage(MAIN_SAIL, 1550);
    });

    controller.on('RIGHT_TRIGGER:reset', function () {
        console.log('right trigger reset');
        sendMessage(MAIN_SAIL, 1500);
    });
});

// controller.on('LEFT_STICK:left', function () {
//     console.log('left stick left');
// });
//
// controller.on('LEFT_STICK:right', function () {
//     console.log('left stick right');
// });
//
// controller.on('LEFT_STICK:reset', function () {
//     console.log('left stick reset');
// });

