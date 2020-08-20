const Bumblebee = require('bumblebee-hotword-node');
const BumbleBeeDeepSpeech = require('bumblebee-deepspeech');

const bumblebee = new Bumblebee();
bumblebee.addHotword('bumblebee');
BumbleBeeDeepSpeech.start({modelPath: './models/deepspeech-0.8.1-models', silenceThreshold: 1000, vadMode: 'VERY_AGGRESSIVE', debug: true}).then(deepspeech =>
{
    console.log('deepsearch finished loading')
    deepspeech.on('recognize', (text, stats) => console.log('translated text: ' + text));

    deepspeech.on('hotword', (text, stats) => console.log('listening...'));

    bumblebee.on('data', (intData, sampleRate, hotword, float32arr) => deepspeech.streamData(intData, sampleRate, hotword, float32arr));

    bumblebee.start();

    console.log('\n Start speech recognition by saying:', 'BUMBLEBEE');
});