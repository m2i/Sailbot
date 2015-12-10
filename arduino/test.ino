#include <Servo.h>

int incomingData = 0;
char buffer[5];
int i = 0;

Servo servo;

void clearBuffer() {
  for (int j = 0; j < 5; j++) {
    buffer[j] = 0;
  }
}

void setup() {
  Serial.begin(9600);
  servo.attach(11);
}

void loop() {
  if (Serial.available() > 0) {
    incomingData = Serial.read();
    char character = (char)incomingData;
    if (character == 'z' || i == 5) {
      buffer[i] = 0;
      //interpret the received message
      if (buffer[0] == 'm') { //move main servo
        int degrees = atoi(buffer + 1);
        servo.write(degrees);
      }
      clearBuffer();
      i = 0;
    } else {
      buffer[i++] = character;
    }
  }
}
