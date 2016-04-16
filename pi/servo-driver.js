const
    MODE1 = 0x00,
    MODE2 = 0x01,
    PRESCALE = 0xFE,
    ALLCALL = 0x01,
    OUTDRV = 0x04,
    LED0_ON_L = 0x06,
    LED0_ON_H = 0x07,
    LED0_OFF_L = 0x08,
    LED0_OFF_H = 0x09,
    SLEEP = 0x10,
    I2C_ADDRESS = 0x40,
    ALL_LED_ON_L = 0xFA,
    ALL_LED_ON_H = 0xFB,
    ALL_LED_OFF_L = 0xFC,
    ALL_LED_OFF_H = 0xFD;

var i2c;

function sleep(ms) {
    var start = new Date().getTime(), expire = start + ms;
    while (new Date().getTime() < expire) { }
    return;
}

function init(givenI2C) {
    i2c = givenI2C;
    setAllPWM(0, 0);
    i2c.writeByteSync(I2C_ADDRESS, MODE2, OUTDRV);
    i2c.writeByteSync(I2C_ADDRESS, MODE1, ALLCALL);
    sleep(0.5);

    var mode1 = i2c.readByteSync(I2C_ADDRESS, MODE1);
    mode1 = mode1 & ~SLEEP;
    i2c.writeByteSync(I2C_ADDRESS, MODE1, mode1);
    sleep(0.5);
}

function setPWM(channel, on, off) {
    i2c.writeByteSync(I2C_ADDRESS, LED0_ON_L+4*channel, on & 0xFF);
    i2c.writeByteSync(I2C_ADDRESS, LED0_ON_H+4*channel, on >> 8);
    i2c.writeByteSync(I2C_ADDRESS, LED0_OFF_L+4*channel, off & 0xFF);
    i2c.writeByteSync(I2C_ADDRESS, LED0_OFF_H+4*channel, off >> 8);
}

function setAllPWM(on, off) {
    i2c.writeByteSync(I2C_ADDRESS, ALL_LED_ON_L, on & 0xFF);
    i2c.writeByteSync(I2C_ADDRESS, ALL_LED_ON_H, on >> 8);
    i2c.writeByteSync(I2C_ADDRESS, ALL_LED_OFF_L, off & 0xFF);
    i2c.writeByteSync(I2C_ADDRESS, ALL_LED_OFF_H, off >> 8);
}

function setPWMFrequency(frequency) {
    var prescaleValue = (25000000 / 4096 / frequency) - 1;
    var prescale = Math.floor(prescaleValue + 0.5);
    var oldMode = i2c.readByteSync(I2C_ADDRESS, MODE1);
    var newMode = (oldMode & 0x7F) | 0x10;
    i2c.writeByteSync(I2C_ADDRESS, MODE1, newMode);
    i2c.writeByteSync(I2C_ADDRESS, PRESCALE, Math.floor(prescale));
    i2c.writeByteSync(I2C_ADDRESS, MODE1, oldMode);
    sleep(0.5);
    i2c.writeByteSync(I2C_ADDRESS, MODE1, oldMode | 0x80);
}

function setServoPulse(channel, pulse) {
    var pulseLength = 1000000;
    pulseLength /= 60;
    pulseLength /= 4096;
    pulse /= pulseLength;
    setPWM(channel, 0, pulse);
}

module.exports = {
    init,
    setPWMFrequency,
    setServoPulse
};