const speech = require('@google-cloud/speech');

// TODO part of tempFix
const {createConverter} = require("./converter");
const Bumblebee = require("bumblebee-hotword-node");

// TODO maybe include the hotword detection in this?
const client = new speech.SpeechClient();


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
                sampleRateHertz: 16000,
                languageCode: 'en-US'
            }};
        this._transcribed = '';
        this.startStream(voiceReceiverStream);
    }

    startStream(voiceReceiverStream)
    {
        this._currentStream = client.streamingRecognize(this._inputFormat)
            .on('error', error =>
                {
                    console.log('google error');
                    console.log(error);
                    return console.error;
                })
            .on('data', data =>
            {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log('google transcribed: ' + this._transcribed);
                this.executeCommand(this._transcribed);
            });

        // Setting up bumblebee for hotword detection
        this._bumblebee = new Bumblebee()
            .on('hotword', (hotword) =>
            {
                console.log('hotword detected');
                if (!this.recording)
                {
                    this._connection.play('ping.mp3');

                    // Temp fix since 'end' event does not work to listen after audio is playing
                    // ping.mp3 is matching the duration of setTimeout
                    // TODO seems like there's an issue with cannot call write after a stream is destroyed
                    this.recording = true;
                    setTimeout(() => {
                        console.log('google recording should be off');
                        this.recording = false;
                        this.restartStream();
                    }, 5000);
                }
            })
            .on('data', data =>
            {
                if (this.recording)
                {
                    console.log('recording');
                    this._currentStream.write(data);
                }
                else
                {
                    console.log('not recording');
                }
            });
        this._bumblebee.addHotword('bumblebee');
        this._bumblebee.start({stream: voiceReceiverStream});
    }

    /**
     * Listen to an audio stream for a specified duration
     *
     * @param stream stream to listen to, audio stream
     * @param duration time to listen to stream in ms
     * @param client discordjs Client
     */
    async listen(client, stream, duration)
    {
        console.log('listening');
        this.available = false;
        stream.pipe(this._currentStream);
        setTimeout(() =>
        {
            this.restartStream(stream);
        }, duration);
    }


    restartStream()
    {
        console.log('restarting')
        this._currentStream.end();
        this._currentStream = client.streamingRecognize(this._inputFormat)
            .on('error', console.error)
            .on('data', data => {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log('google transcribed: ' + this._transcribed);
                this.executeCommand(this._transcribed);
            });
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

    shutdown()
    {

    }
}

module.exports = {VoiceRecognitionService};