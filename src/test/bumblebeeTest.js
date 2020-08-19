const Bumblebee = require('bumblebee-hotword-node');
const bumblebee = new Bumblebee();
bumblebee.addHotword('bumblebee');
bumblebee.on('hotword', hotword => console.log('hot word detected: ' + hotword));
bumblebee.start();
