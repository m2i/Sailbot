Requirements:

Pi: Node.js v4.x.x
Base: Node.js 0.12.x

Instructions:

1. Connect both radios, make sure that both show a solid green light
2. Connect xbox wireless receiver
3. Connect xbox controller (make sure its paired with the receiver)
4. On the pi, navigate to ~/Documents/javascript
5. On the pi, run `sudo node index.js`
6. On the base station, navigate to wherever you pulled down the code
7. On the base station, run `node index.js`
8. Adjust the potentiometers so that neither servos are moving
9. You are now ready to use the xbox controller to control the servos.

Controls:

Right joystick - Main servo
Left joystick - Aft servo
Triggers - Rudder servo