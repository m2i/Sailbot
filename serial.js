var SerialPort = require('serialport').SerialPort

var serialPort;

var opened = false;

var buffer = '';

var init = function (callback) {
	serialPort = new SerialPort('/dev/ttyACM0', {
		baudrate: 9600
	});
	serialPort.on('open', function () {
		opened = true;
		serialPort.on('data', function (data) {
			buffer = buffer.concat(data);
		});
		console.log('Serial Port opened, waiting for Arduino...');
		setTimeout(function () {
			console.log('done');
			if (callback) callback();
		}, 5000);
	});
};

var sendMessage = function (message, callback) {
	if (opened) {
		serialPort.write(message + 'z', function(err, results) {
			if (callback) callback();
		});
	} else {
		console.log('Serial port has not been opened yet!');
	}
}

var getMessages = function () {
	var newString = buffer;
	buffer = '';
	return newString;
};

var hasMessages = function () {
	return buffer !== '';
};

module.exports = {
	sendMessage : sendMessage,
	init : init,
	getMessages : getMessages,
	hasMessages : hasMessages
};