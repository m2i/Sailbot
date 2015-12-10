var serial = require('serialport'),
    SerialPort = serial.SerialPort;

var serialPort = new SerialPort('/dev/ttyACM0', {
		baudrate: 9600
	}, false);

var send = function (message, callback) {
	serialPort.open(function (error) {
		if (error) {
			console.log('Failed to open Serial Port: ' + error);
		} else {
			serialPort.write(message, function (err) {
				if (err) {
					console.log('Failed to send message: ' + err);
					serialPort.close(function () {
						if (callback) callback();
					});
				} else {
					serialPort.drain(function () {
						serialPort.close(function () {
							if (callback) callback();
						});
					});
				}
			});
		}
	});
};

var receive = function () {
	serialPort.open(function (error) {
		if (error) {
			console.log('Failed to open Serial Port: ' + error);
		} else {
			serialPort.on('data', function(data) {
			console.log(data);
				serialPort.close(function () {
					return data;
				});
			});
		}
	});
};

module.exports = {
	send : send,
	receive : receive
};