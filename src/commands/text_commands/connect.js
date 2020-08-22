const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../../util.js');
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

            const voiceReceiver = connection.receiver.createStream(member.user,
                {mode: 'pcm', end: 'manual'});

            // Make voice streams for voice commands
            const voiceRecorderStream = createConverter(voiceReceiver)
            const vr = new VoiceRecognitionService(connection, voiceRecorderStream);

            // Store the connection to the server, the dispatcher to the server, and voice streams of current user.
            message.client.voiceConnections.set(message.guild.id,
                createVoiceConnectionData(connection,
                    undefined,
                    voiceRecorderStream,
                    vr));

            console.log(`created audio stream for ${member.user}`);
        } else {
            await message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
        }
    });