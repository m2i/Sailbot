var serialPort = require('serialport'),
    SerialPort = serialPort.SerialPort,
    serial;


function init(onData, callback) {
    serial = new SerialPort('/dev/ttyUSB0', {
        parser: serialPort.parsers.readline('\n'),
        baudrate: 57600
    });
    serial.on('open', () => {
        serial.on('data', onData);
        callback();
    });
}

function write(message) {
    serial.write(message);
}

module.exports = {
    init,
    write
};