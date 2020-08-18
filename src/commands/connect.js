const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../util.js');
const sox = require('sox-stream');
const fs = require('fs');
// const {src, dst} = require('../../config/audio_format.json');
const Bumblebee = require('bumblebee-hotword-node');

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
                    // Stream that converts s16le 48000 hz 2 channel to s16le 16000hz 1 channel
                    const transcode = sox({
                        output: {
                            bits: 16,
                            rate: 16000,
                            channels: 1,
                            type: 'raw'},
                        input: {
                            bits: 16,
                            rate: 48000,
                            channels: 2,
                            type: 'raw',
                            encoding: 'signed-integer'}});

                    const audioStream = connection.receiver.createStream(member.user,
                        {mode: 'pcm', end: 'manual'});
                    // audioStream.on('data', data => console.log(data));
                    audioStream.pipe(transcode, {end: false});

                    transcode.pipe(fs.createWriteStream('functioning_stupid_fux.raw'));

                    // const bumblebee = new Bumblebee();
                    // bumblebee.addHotword('bumblebee');
                    // bumblebee.on('hotword', function (hotword) {
                    //     console.log('Hotword Detected:', hotword);
                    // });
                    // bumblebee.start({stream: transcode});
                    //
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