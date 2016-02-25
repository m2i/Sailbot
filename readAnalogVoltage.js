// Javascript program to read analog voltage from the Raspberry Pi


var readADC = function( ADCnum, clockpin, mosipin, misopin, cspin) {
        if ((ADCnum > 7 || ADCnum < 0)) {
                return -1 
        }
        var commandOut;
        
        cspin.writeSync(1); 
        
        clockpin.writeSync(0);          // bring clockpin low
        cspin.writeSync(0);              // bring CS low
        
        var commandOut = ADCnum;
        commandOut |= 0x18;
        commandOut <<= 3;
        
        for (var i = 0; i < 5; i++) {
                if (commandOut && 0x80){
                        mosipin.writeSync(1);
                } else {
                        mosipin.writeSync(0);
                }
                
                commandOut <<= 1;
                clockpin.writeSync(1);
                clockpin.writeSync(0);
        }
        
        ADCout = 0;
        // read in one empty bit, one null bit and 10 ADC bits
        for (var i = 0; i < 12; i++) {
                clockpin.writeSync(1);
                clockpin.writeSync(0);
                //ADCout <<= 1
                if (misopin == 1) {
                        // ADCout |= 1
                }
        }
        cspin.writeSync(1);
        
        ADCout >>= 1;                // first bit is 'null' so drop it
        return ADCout;
};

var GPIO = require('onoff').Gpio,
        SPICLK = new GPIO(18, 'out'),
        SPIMISO = new GPIO(23, 'in'),
        SPIMOSI = new GPIO(24, 'out'),
        SPICS = new GPIO(25, 'out');

var potentiometerADC = 0;
var lastRead = 0;       // This keeps track of the last potentiometer value
var tolerance = 5;      // to keep from being jittery we'll only change the 
                                // the volume when the pot has moved more than 5 'counts'

var trimPotChanged, trimPot, potAdjust, anemometer;

while (1) {
        // assume that the potentiometer didn't move
        trimPotChanged = 0;
        
        // read the analog pin
        trimPot = readADC(potentiometerADC, SPICLK, SPIMOSI, SPIMISO, SPICS);
        // how much has it changed since the last read?
        potAdjust = Math.abs(trimPot - lastRead);
        
        if (potAdjust > tolerance) {
                trimPotChanged = 1;
        }
        
        if (trimPotChanged == 1) {
                console.log('\ntrimPot is %d', trimPot);
                
                anemometer = Math.round((trimPot - 124) * 2.0625);
                if (anemometer < 0) {
                        anemometer = 0;
                }
                console.log('I am changing')
                console.log('anemometer is %d', anemometer);
                console.log('wind speed is %d m/s', Math.round(anemometer * 32.4 / 1023));
                
                lastRead = trimPot;
        }
        
}
        
        