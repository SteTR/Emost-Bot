const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../../util.js');
// const {src, dst} = require('../../config/audio_format.json');
const Bumblebee = require('bumblebee-hotword-node');
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
                                          {mode: 'pcm', end: 'manual'}))

            const vr = new VoiceRecognitionService(connection);
            // Voice Recognition Package
            // TODO initialize bumblebee outside
            const bumblebee = new Bumblebee().on('hotword', (hotword) => {
                    if (vr.available) vr.listen(message.client, voiceRecorderStream, 5000);
                });

            bumblebee.addHotword('bumblebee');
            bumblebee.start({stream: voiceRecorderStream});

            // Store the connection to the server, the dispatcher to the server, and voice streams of current user.
            message.client.voiceConnections.set(message.guild.id,
                createVoiceConnectionData(connection,
                    undefined,
                    voiceRecorderStream));
            /* TODO:
             * Issue:
             * Bumblebee would stop listening to the audio stream with .on('data')
             *
             * Temp Solution:
             * Remake bumblebee and the converter
             *
             */
            member.client.voiceConnections.get(message.guild.id).followingUser = member.user;
            member.client.voiceConnections.get(message.guild.id).bumblebee = bumblebee;

            console.log(`created audio stream for ${member.user}`);
        } else {
            await message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
        }
    });


