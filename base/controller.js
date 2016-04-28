var gamepad = require('gamepad');

function noop() {}

var LEFT_STICK = 0,
    RIGHT_STICK = 2,
    LEFT_TRIGGER = 4,
    RIGHT_TRIGGER = 5;

var functions = {
    'LEFT_STICK:left': noop,
    'LEFT_STICK:right': noop,
    'LEFT_STICK:reset': noop,
    'RIGHT_STICK:left': noop,
    'RIGHT_STICK:right': noop,
    'RIGHT_STICK:reset': noop,
    'LEFT_TRIGGER': noop,
    'LEFT_TRIGGER:reset': noop,
    'RIGHT_TRIGGER': noop,
    'RIGHT_TRIGGER:reset': noop
};

var values = {
    0: 0,
    2: 0,
    4: 0,
    5: 0
};

function init() {
    gamepad.init();
    setInterval(gamepad.processEvents, 16);
    setInterval(gamepad.detectDevices, 500);
}

function on(string, callback) {
    if (Object.keys(functions).indexOf(string) !== -1) {
        functions[string] = callback;
    }
}

gamepad.on('move', function (id, axis, value) {
    var previous = values[axis];
    if (axis === LEFT_STICK || axis === RIGHT_STICK) {
        var func = axis === LEFT_STICK ? 'LEFT_STICK' : 'RIGHT_STICK';
        if (value <= -0.5 && previous > -0.5) {
            functions[func + ':left']();
        } else if (value >= 0.5 && previous < 0.5) {
            functions[func + ':right']();
        } else if (value > -0.5 && value < 0.5 && (previous <= -0.5 || previous >= 0.5)) {
            functions[func + ':reset']();
        }
    } else if (axis === LEFT_TRIGGER || axis === RIGHT_TRIGGER) {
        var func = axis === LEFT_TRIGGER ? 'LEFT_TRIGGER' : 'RIGHT_TRIGGER';
        if (value >= 0.5 && previous < 0.5) {
            functions[func]();
        } else if (value < 0.5 && previous >= 0.5) {
            functions[func + ':reset']();
        }
    } else {
        return;
    }
    values[axis] = value;
});

module.exports = {
    init: init,
    on: on
};