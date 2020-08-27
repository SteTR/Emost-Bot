const speech = require('@google-cloud/speech');
const Bumblebee = require("bumblebee-hotword-node");
const client = new speech.SpeechClient();

// TODO maybe use single_utterance for shorter queries but will require two hotwords
class VoiceRecognitionService
{
    constructor(hotword, connection, voiceReceiverStream)
    {
        // boolean to check if it's currently recording to google speech api
        this.recording = false;
        this._connection = connection;
        this._guild = connection.channel.guild
        this._inputFormat = {
            config:
            {
                encoding: 'LINEAR16',
                audioChannelCount: 1,
                sampleRateHertz: 16000,
                languageCode: 'en-US'
            }};
        this._transcribed = '';
        this.startBumblebee(hotword, voiceReceiverStream);
    }

    startBumblebee(hotword, voiceReceiverStream)
    {
        // Setting up bumblebee for hotword detection
        this._bumblebee = new Bumblebee()
            .on('hotword', async (hotword) =>
            {
                if (!this.recording)
                {
                    await this.startStream();
                    this.recording = true;
                    // TODO maybe separate logic of connections into different?

                    setTimeout(async () => {
                        console.log(`Guild ${this._guild.id}: Disabled Google Stream from Listening`);
                        this.recording = false;
                        this.shutdownStream();
                    }, 5000);
                }
            })
            .on('data', data =>
            {
                if (this.recording)
                {
                    if (this._currentStream.destroyed) throw new Error(`Guild ${this._guild.id}: Stream was destroyed when attempting to send data from bumblebee to Google`)
                    this._currentStream.write(data);
                }
            });

        this._bumblebee.addHotword(hotword);

        this._bumblebee.on('error', (error) =>
        {
            console.log(`Guild ${this._guild.id}: Bumblebee Error: ${error}`);
            this.startBumblebee(voiceReceiverStream);
        })
        this._bumblebee.start({stream: voiceReceiverStream});
    }

    startStream()
    {
        this._currentStream = client.streamingRecognize(this._inputFormat)
            .on('error', error => console.error(`Guild ${this._guild.id}: Google API error ${error}`))
            .on('data', data =>
            {
                this._transcribed = data.results[0].alternatives[0].transcript;
                console.log(`Guild ${this._guild.id}: Google API Transcribed: ${this._transcribed}`);
                this.executeCommand(this._transcribed);
            });
    }

    shutdownStream()
    {
        console.log(`Guild ${this._guild.id}: Shutting Down Google Stream`);
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
        const client = this._connection.client;
        const stuff = client.voiceConnections.get(this._connection.channel.guild.id);

        stuff.textChannel.send(`<@${stuff.listeningTo.id}> said: \"${(transcribed) ? transcribed : "..."}\"`);
        let arrayed_transcribed = transcribed.split(" ");
        const stringCommand = arrayed_transcribed.shift().toLowerCase();
        const command = client.voiceCommands.get(stringCommand);
        if (command === undefined)
        {
            console.log(`Guild ${this._guild.id}: ${stringCommand} command not available`);
            stuff.textChannel.send(`${command} is not available`);
            return;
        }
        command.execute(client, this._connection.channel.guild, arrayed_transcribed);
    }

    shutdown()
    {
        this._bumblebee.destroy();
        this._connection.disconnect();
    }
}

module.exports = {VoiceRecognitionService};