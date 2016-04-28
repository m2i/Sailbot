var gpio = require("pi-gpio"),
    async = require('async');

const ERRORS = {
    open: 'Error opening up pins:',
    close: 'Error closing pins:',
    read: 'Error reading pins:',
    write: 'Error writing to pins:',
    setDirection: 'Error setting direction on pins:'
};

function execute(pins, task, callback) {
    const tasks = Object.keys(pins).map(pin =>
        done => {
            const value = pins[pin];
            if (value === -1) {
                gpio[task](pin, (error, results) => {
                    done(error, results);
                });
            } else {
                gpio[task](pin, value, (error, results) => {
                    done(error, results);
                });
            }
        }
    );
    async.parallel(tasks, (error, results) => {
        if (error) {
            console.log(ERRORS[task], error);
        }
        callback(error, results);
    });
}

function createObjectFromArray(array) {
    var result = {};
    array.forEach((number) => {
        result[number] = -1;
    });
    return result;
}

function open(pins, callback) {
    execute(createObjectFromArray(pins), 'open', callback);
}

function close(pins, callback) {
    execute(createObjectFromArray(pins), 'close', callback);
}

function read(pins, callback) {
    var direction = {};
    pins.forEach((pin) => {
        direction[pin] = 'input';
    });
    execute(direction, 'setDirection', () => {
        if (error) {
            callback(error);
        } else {
            execute(pins, 'write', callback);
        }
    });
}

function write(pins, callback) {
    var direction = {};
    pins.forEach((pin) => {
        direction[pin] = 'output'; 
    });
    execute(direction, 'setDirection', () => {
        if (error) {
            callback(error);
        } else {
            execute(pins, 'write', callback);
        }
    });
}

module.exports = {
    open, close, read, write
};
