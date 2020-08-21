async function main() {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    const fs = require('fs');

    // Creates a client
    const client = new speech.SpeechClient();

    const request = {config: {encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'en-US'}};

    const recognizeStream = client.streamingRecognize(request)
        .on('error', console.error)
        .on('data', data => console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`));

    fs.createReadStream('./res/google-speech.wav').pipe(recognizeStream);
}
main().catch(console.error);