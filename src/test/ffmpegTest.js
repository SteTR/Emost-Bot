const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const cmd = ffmpeg(fs.createReadStream('pre_Steven_noedits.raw'))
    .inputOptions(['-f s16le', '-ac 2', '-ar 48000'])
    .outputOptions(['-ac 1', '-ar 16000'])
    .save('testFuckYou.wav');