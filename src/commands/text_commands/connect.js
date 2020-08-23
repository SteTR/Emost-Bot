const {createCommand, fixVoiceReceive, createVoiceConnectionData} = require('../../util.js');
const {createConverter} = require('../../converter');

const {VoiceRecognitionService} = require('../../VoiceRecognitionService');

module.exports = createCommand("connect",
    "connect to server and set up streams.",
    async message => {
        const member = message.member;
        const botPermissions = message.channel.permissionsFor(message.client.user);
        // Check if bot has permission to message in channel.
        if (!botPermissions.has("SEND MESSAGES"))
        {
            // Message user for sending message access in respective text channel
            return message.author.send(`I do not have permissions to message in the text channel ${message.channel}. 
            Give me permission or use the command in a different text channel.`);
        }

        // User who made the command is not in a voice channel
        if (!member.voice.channel) return message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`);

        const voiceChannelPermissions = member.voice.channel.permissionsFor(message.client.user);

        // Check if bot has permissions to speak and connection
        if (!voiceChannelPermissions.has("SPEAK") || !voiceChannelPermissions.has("CONNECT"))
        {
            return message.channel.send(`Can not connect to<@${message.author.id}>'s voice channel. 
            I need speak and connect permissions to the voice channel.`);
        }

        const connection = await member.voice.channel.join()
            .then(message.channel.send(`Connected to ${member.voice.channel}.`));

        // play static noise to get voice receive functioning. Some undocumented discord requirement to receive audio
        fixVoiceReceive(connection);

        const voiceReceiver = connection.receiver.createStream(member.user,
            {mode: 'pcm', end: 'manual'});

        // Make voice streams for voice commands
        const voiceRecorderStream = createConverter(voiceReceiver)
        const vr = new VoiceRecognitionService(connection, voiceRecorderStream);

        // Store the connection to the server, the dispatcher to the server, and voice streams of current user.
        message.client.voiceConnections.set(message.guild.id, createVoiceConnectionData(connection, vr, member.user, message.channel));

        console.log(`created audio stream for ${member.user}`);
    });