var SerialPort = require('serialport').SerialPort,
    stdin = process.openStdin(),
    port = 'COM3',
    baudrate = 57600;

var serialPort = new SerialPort(port, {
    baudrate: baudrate
});

serialPort.on('open', () => {
    console.log('Ready. Enter a pulse value to send:');
    stdin.addListener("data", data => {
        serialPort.write(data.toString().trim() + '\n', () => {
            console.log('Sent');
        });
    });
});

