var serial = require('./serial.js');

serial.init(function () {
	serial.sendMessage("m60z");
	console.log('Received messages:\n');
	setInterval(function () {
		if (serial.hasMessages()) {
			console.log(serial.getMessages());
		}
	}, 1000);
});