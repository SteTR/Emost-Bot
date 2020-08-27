const ffmpeg = require('fluent-ffmpeg');

/**
 * Creates a audio stream convert to convert one audio stream's format to another.
 * E.g. 48000 Hz 2 channel to 16000 Hz 1 channel
 * @param stream input audio stream
 * @param inputArray array of flags for ffmpeg to describe input format
 * @param outputArray  array of flags for ffmpeg to describe output format
 * @param formatType REQUIRED. the format of the output (e.g. s16le)
 * @returns {stream.Writable|{end: boolean}|*} a new stream that has converted the input audio stream into the format requested
 */
function createConverter(stream, inputArray = ['-f s16le', '-ac 2', '-ar 48000'],
                         outputArray = ['-ac 1', '-ar 16000'], formatType = 's16le')
{
    return new ffmpeg().input(stream)
        .inputOptions(inputArray).outputOptions(outputArray)
        .format(formatType).pipe({end: false});
}

module.exports = {createConverter}