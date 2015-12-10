var serial = require('./serial.js');

serial.init(function () {
	var stdin = process.openStdin();
	console.log("Console started.");
	console.log("Anything you type will be sent to the Arduino after pressing [enter]");
	console.log("with the exception of \"getMessages\", which will display received messages.");
	stdin.addListener("data", function(d) {
		var string = d.toString().trim();
		if (string === 'getMessages') {
			console.log(serial.getMessages());
		} else {
			serial.sendMessage(string);
		}
	});
});