const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../util.js');
const fs = require('fs');
// const {src, dst} = require('../../config/audio_format.json');
const Bumblebee = require('bumblebee-hotword-node');
const ffmpeg = require('fluent-ffmpeg');
// const processSpawn = require('child_process')

module.exports = createCommand("connect",
    "connect to server and set up streams.",
    async message =>
    {
        if (message.member.voice.channel)
        {
            const member = message.member;
            const connection = await member.voice.channel.join()
                .then(message.channel.send(`Connected to ${member.voice.channel}.`));
            const dispatcher = fixVoiceReceive(connection);
            const userStreams = [];

            const audioStream = connection.receiver.createStream(member.user, {mode: 'pcm', end: 'manual'});

            // Make voice streams for voice commands
            const command = new ffmpeg().input(audioStream)
                .inputOptions(['-f s16le', '-ac 2', '-ar 48000'])
                .outputOptions(['-ac 1', '-ar 16000']).pipe();

            // command.on('error', err => console.log(err));
            // command.on('end', (stdout, stderr) => console.log('we finished :0'));

            // Voice Recognition Package
            const bumblebee = new Bumblebee();
            bumblebee.addHotword('bumblebee');
            bumblebee.on('hotword', hotword => console.log('hot word detected: ' + hotword));
            bumblebee.start({stream: command});

            console.log(`created audio stream for ${member.user}`);

            userStreams.push(audioStream);

            // Store the connection to the server, the dispatcher to the server, and voice streams of each user in the voice channel.
            message.client.voiceConnections.set(message.guild.id, createVoiceConnectionData(connection, dispatcher, userStreams));
        }
        else
        {
            await message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
        }
    });