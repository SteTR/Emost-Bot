const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../../util.js');
const fs = require('fs');
// const {src, dst} = require('../../config/audio_format.json');
const ytdl = require('ytdl-core');
const Bumblebee = require('bumblebee-hotword-node');
const ffmpeg = require('fluent-ffmpeg');
const {createConverter} = require('../../converter');

const {VoiceRecognitionService} = require('../../VoiceRecognitionService');

module.exports = createCommand("connect",
    "connect to server and set up streams.",
    async message => {
        if (message.member.voice.channel) {
            const member = message.member;
            const connection = await member.voice.channel.join()
                .then(message.channel.send(`Connected to ${member.voice.channel}.`));

            // play static noise to get voice functioning
            fixVoiceReceive(connection);

            // Make voice streams for voice commands
            const voiceRecorderStream = createConverter(
                connection.receiver.createStream(member.user,
                                          {mode: 'pcm', end: 'manual'}),
                ['-f s16le', '-ac 2', '-ar 48000'],
                ['-ac 1', '-ar 16000'],
                's16le')

            const vr = new VoiceRecognitionService(connection);
            // Voice Recognition Package
            // TODO initialize bumblebee outside
            const bumblebee = new Bumblebee().on('hotword', (hotword) => {
                    if (vr.available)
                    {
                        vr.listen(message.client, voiceRecorderStream, 5000);
                    }
                });

            // TODO bug after stt, bumblebee stops working because of piping probably.
            bumblebee.on('data', (d) => console.log(d));

            bumblebee.addHotword('bumblebee');
            bumblebee.start({stream: voiceRecorderStream});

            // Store the connection to the server, the dispatcher to the server, and voice streams of current user.
            message.client.voiceConnections.set(message.guild.id,
                createVoiceConnectionData(connection,
                    undefined,
                    voiceRecorderStream));
            console.log(`created audio stream for ${member.user}`);
        } else {
            await message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
        }
    });


