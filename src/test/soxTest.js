const sox = require('sox-stream');
const fs = require('fs');

const transcode = sox({
    output: {
        bits: 16,
        rate: 16000,
        channels: 1,
        type: 'raw'
    },
    input: {
        bits: 16,
        rate: 48000,
        channels: 2,
        type: 'raw',
        encoding: 'signed-integer'
    }
});

fs.createReadStream('../test_edison.PCM').pipe(transcode).pipe(fs.createWriteStream('real_output.PCM'));