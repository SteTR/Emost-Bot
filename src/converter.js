const ffmpeg = require('fluent-ffmpeg');

function createConverter(stream, inputArray, outputArray, formatType)
{
    return new ffmpeg().input(stream)
        .inputOptions(inputArray).outputOptions(outputArray)
        .format(formatType).pipe({end: false});
}


module.exports = {createConverter}