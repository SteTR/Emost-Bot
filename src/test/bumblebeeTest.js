const Bumblebee = require('bumblebee-hotword-node');
const BumbleBeeDeepSpeech = require('bumblebee-deepspeech');

const bumblebee = new Bumblebee();
bumblebee.addHotword('bumblebee');
BumbleBeeDeepSpeech.start(
    {modelPath: './models/deepspeech-0.8.1-models',
        silenceThreshold: 500,
        vadMode: 'NORMAL',
        debug: false})
    .then(deepspeech =>
    {
        console.log('deepsearch finished loading')
        deepspeech.on('recognize', (text, stats) => console.log('translated text: ' + text));

        bumblebee.on('data', (intData, sampleRate, hotword, float32arr) =>
        {
            console.log(intData);
            deepspeech.streamData(intData, sampleRate, hotword, float32arr)
        });

        bumblebee.start();

        console.log('\n Started speech recognition');
    });