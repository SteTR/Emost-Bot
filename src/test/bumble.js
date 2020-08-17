const bee = require('bumblebee-hotword-node');
const sox = require('sox-stream');

const bumble = new bee()
bumble.addHotword('hey_e_most', require('../hotwords/hey_e_most.js'));
bumble.on('hotword', (hotword) => console.log('Hotword Detected:', hotword));

bumble.start()