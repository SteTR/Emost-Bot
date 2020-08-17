const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../util.js');
const sox = require('sox-stream');
const fs = require('fs');
const {src, dst} = require('../../config/audio_format.json');
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
                    const audioStream = connection.receiver.createStream(member.user,
                        {mode: 'pcm', end: 'manual'});

                    // Converts s16le 48000 hz 2 channel to s16le 16000hz 1 channel
                    const transcode = sox({
                        output: {
                            bits: dst.bits,
                            rate: dst.sample_rate,
                            channels: dst.channels,
                            type: dst.type},
                        input: {
                            bits: src.bits,
                            rate: src.sample_rate,
                            channels: src.channels,
                            type: src.type,
                            encoding: src.encoding}});

                    // Write the raw
                    /*../../temp_voices/og/*/
                    audioStream.pipe(fs.createWriteStream(`pre_${member.user.id}.raw`));


                    // write the transcoded
                    /*./../temp_voices/transcoded/*/
                    audioStream.pipe(transcode)
                        .pipe(fs.createWriteStream(`${member.user.id}.raw`));

                    // Pass to hotword detection
                    const bee = new Bumblebee();

                    bee.addHotword('hey_e_most', require('../hotwords/hey_e_most.js'));

                    bee.on('hotword', (hotword) => console.log('Hotword Detected:', hotword));
                    bee.start({stream: audioStream, sampleRate: undefined});

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