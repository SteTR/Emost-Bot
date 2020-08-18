const sox = require('sox-stream');
const fs = require('fs');
const Bumblebee = require('bumblebee-hotword-node');

const src = fs.createReadStream('./Steven_bumblebee_noedit.raw');
const dst = fs.createWriteStream('./Steven_bumblebee.raw');

const transcode = sox({
    output: {
        bits: 16,
        rate: 16000,
        channels: 1,
        type: 'raw'},
    input: {
        bits: 16,
        rate: 48000,
        channels: 2,
        type: 'raw',
        encoding: 'signed-integer'}});
transcode.on('data', (data) => console.log('data received'));

transcode.on('error', function (err) {
    console.log('oh no! ' + err.message)
})

src.pipe(transcode);

const bumblebee = new Bumblebee();
bumblebee.addHotword('bumblebee');
bumblebee.on('hotword', function (hotword) {
    console.log('Hotword Detected:', hotword);
});

bumblebee.start({stream: transcode});
