const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../util.js');
const fs = require('fs');
// const {src, dst} = require('../../config/audio_format.json');
const Bumblebee = require('bumblebee-hotword-node');
const ffmpeg = require('fluent-ffmpeg');

module.exports = createCommand("connect",
    "connect to server and set up streams.",
    async message =>
    {
        if (message.member.voice.channel)
        {
            const connection = await message.member.voice.channel.join()
                .then(message.channel.send(`Connected to ${message.member.voice.channel}.`));
            const dispatcher = fixVoiceReceive(connection);
            const userStreams = [];

            // Make voice streams for voice commands
            message.guild.me.voice.channel.members.forEach(member =>
            {
                if (member.user.id !== message.client.user.id)
                {
                    const audioStream = connection.receiver.createStream(member.user,
                        {mode: 'pcm', end: 'manual'});

                    const command = new ffmpeg(audioStream).inputFormat('s16le').audioChannels(1).audioFrequency(16000);

                    command.on('error', err => console.log(err));
                    command.on('end', (stdout, stderr) => console.log('we finished :0'));

                    // Voice Recognition Package
                    // const bumblebee = new Bumblebee();
                    // bumblebee.addHotword('bumblebee');
                    // bumblebee.on('hotword', function (hotword) {
                    //     console.log('Hotword Detected:', hotword);
                    // });
                    // bumblebee.start({stream: transcode});

                    userStreams.push(audioStream);
                    console.log(`created audio stream for ${member.user}`);
                }
            });

            // Store the connection to the server, the dispatcher to the server, and voice streams of each user in the voice channel.
            message.client.voiceConnections.set(message.guild.id, createVoiceConnectionData(connection, dispatcher, userStreams));
        }
        else
        {
            await message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
        }
    });