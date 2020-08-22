const ffmpeg = require('fluent-ffmpeg');

function createConverter(stream, inputArray = ['-f s16le', '-ac 2', '-ar 48000'],
                         outputArray = ['-ac 1', '-ar 16000'], formatType = 's16le')
{
    return new ffmpeg().input(stream)
        .inputOptions(inputArray).outputOptions(outputArray)
        .format(formatType).pipe({end: false});
}


module.exports = {createConverter}