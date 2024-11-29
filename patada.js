import Arduino from './js/arduino.js';
import Protobject from './js/protobject.js';

Arduino.start();
Protobject.onReceived((data) => {
   Arduino.servoWrite({ pin: 5, value: data.speed });
});




