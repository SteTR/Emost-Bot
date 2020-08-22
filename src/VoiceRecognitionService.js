const speech = require('@google-cloud/speech');

// TODO part of tempFix
const {createConverter} = require("./converter");
const Bumblebee = require("bumblebee-hotword-node");

// TODO maybe include the hotword detection in this?
class VoiceRecognitionService
{
    constructor(connection)
    {
        this.available = true;
        this._connection = connection;
        this._inputFormat = {config:
                {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US'
                }};
        this._transcribed = '';
        this._client = new speech.SpeechClient();
        this._currentStream = this._client.streamingRecognize(this._inputFormat)
            .on('error', console.error)
            .on('data', data =>
            {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log('google transcribed: ' + this._transcribed);
                this.executeCommand(this._transcribed);
                this.available = true;
            });


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
            this.restart(stream);
            this.tempFix(client);
        }, duration);
    }

    tempFix(client)
    {
        /* TODO:
         * Issue:
         * Bumblebee would stop listening to the audio stream with .on('data')
         *
         * Temp Solution:
         * Remake bumblebee and the converter
         *
         */
        const guild = this._connection.channel.guild;
        const serverInfo = client.voiceConnections.get(guild.id)
        const voiceRecorderStream = createConverter(
            this._connection.receiver.createStream(serverInfo.followingUser,
                {mode: 'pcm', end: 'manual'}));
        const bumblebee = new Bumblebee().on('hotword', (hotword) =>
        {
            if (this.available) this.listen(client, voiceRecorderStream, 5000)
        });
        bumblebee.addHotword('bumblebee');
        serverInfo.voiceRecorderStream = voiceRecorderStream;
        serverInfo.bumblebee = bumblebee;
        bumblebee.start({stream: voiceRecorderStream});
    }

    restart(stream)
    {
        console.log('restarting')
        stream.unpipe(this._currentStream);
        this._currentStream.end();
        this._currentStream = this._client.streamingRecognize(this._inputFormat)
            .on('error', console.error)
            .on('data', data => {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log('google transcribed: ' + this._transcribed);
                this.executeCommand(this._transcribed);
                this.available = true;
            });

    }

    /**
     * Executes command given the transcribed text
     *
     * @param client discordjs client
     * @param transcribed
     * @returns {Promise<void>}
     */
    async executeCommand(transcribed)
    {
        const client = this._connection.client;
        let arrayed_transcribed = transcribed.split(" ");
        const stringCommand = arrayed_transcribed.shift().toLowerCase();
        const command = client.voiceCommands.get(stringCommand);
        if (command === undefined)
        {
            console.log(`command ${stringCommand} not available`);
            return;
        }
        command.execute(client, this._connection.channel.guild, arrayed_transcribed);
    }
}


module.exports = {VoiceRecognitionService};