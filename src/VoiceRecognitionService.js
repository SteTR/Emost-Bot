const speech = require('@google-cloud/speech');
const Bumblebee = require("bumblebee-hotword-node");
const client = new speech.SpeechClient();

// TODO maybe use single_utterance for shorter queries but will require two hotwords
class VoiceRecognitionService
{
    constructor(connection, voiceReceiverStream)
    {
        // boolean to check if it's currently recording to google speech api
        this.recording = false;
        this._connection = connection;
        this._inputFormat = {
            config:
            {
                encoding: 'LINEAR16',
                audioChannelCount: 1,
                sampleRateHertz: 16000,
                languageCode: 'en-US'
            }};
        this._transcribed = '';
        this.startBumblebee(voiceReceiverStream);
    }

    startBumblebee(voiceReceiverStream)
    {
        // Setting up bumblebee for hotword detection
        this._bumblebee = new Bumblebee()
            .on('hotword', async (hotword) =>
            {
                console.log('hotword detected');
                if (!this.recording)
                {
                    this.recording = true;
                    this._connection.play('ping.mp3');
                    await this.startStream();

                    setTimeout(() => {
                        console.log('Disabled Google Stream from Listening');
                        this.recording = false;
                        this.shutdownStream();
                    }, 5000);
                }
            })
            .on('data', data =>
            {
                if (this.recording)
                {
                    if (this._currentStream.destroyed) throw new Error('Stream was destroyed when attempting to send data from bumblebee to Google')
                    this._currentStream.write(data);
                }
            });

        this._bumblebee.addHotword('bumblebee');
        this._bumblebee.start({stream: voiceReceiverStream});
    }

    startStream()
    {
        this._currentStream = client.streamingRecognize(this._inputFormat)
            .on('error', error => console.error('Google API error ' + error))
            .on('data', data =>
            {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log('Google API Transcribed: ' + this._transcribed);
                this.executeCommand(this._transcribed);
            });
    }

    shutdownStream()
    {
        console.log('Shutting Down Google Stream');
        this._currentStream.end();
    }

    /**
     * Executes command given the transcribed text
     *
     * @param transcribed
     * @returns {Promise<void>}
     */
    async executeCommand(transcribed)
    {
        console.log(transcribed)
        const client = this._connection.client;
        let arrayed_transcribed = transcribed.split(" ");
        const stringCommand = arrayed_transcribed.shift().toLowerCase();
        const command = client.voiceCommands.get(stringCommand);
        if (command === undefined)
        {
            console.log(`${stringCommand} command not available`);
            return;
        }
        command.execute(client, this._connection.channel.guild, arrayed_transcribed);
    }
}

module.exports = {VoiceRecognitionService};