const ffmpeg = require('fluent-ffmpeg');

const command = new ffmpeg('pre_Steven_noedits.raw').inputFormat('s16le').audioChannels(1).audioFrequency(16000).saveToFile('ffmpeg_output.wav');