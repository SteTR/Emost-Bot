/**
 * Create the function bot here and all the bot controls.
 * Use index.js to start the bot.
 */
const env = require('dotenv').config({path: '../.env'});
const config = require('../config/config.json');
const Discord = require('discord.js');
const fs = require('fs'); // TODO remove
const ytdl = require('ytdl-core');
const voiceRecognition = require('./bbb.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.voiceConnections = new Discord.Collection(); // TODO this could be a refactor

// Re-add any servers that bot is still connected.
// TODO

function createVoiceConnectionData(connection, dispatcher = undefined, userStreams = [])
{
    return {connection: connection, dispatcher: dispatcher, userStreams: userStreams};
}

function createBot()
{
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
}

function fixVoiceReceive(connection)
{
    // Play something to send a opcode 5 payload (apparently a requirement that was not documented)
    // https://github.com/discord/discord-api-docs/issues/808
    const dispatcher = connection.play(ytdl(config.initial_audio_src,
                                            {filter: "audioonly", range: {start: 0, end: 5000}}));
    dispatcher.on("start", () => {
        console.log("Starting initial audio for payload request");
    });
    dispatcher.on("finish", () => {
        console.log("Finished the initial audio");
    });
    dispatcher.on("end", (end) => {
        console.log("Ended the initial audio");
    });
    return dispatcher;
}

// add commands
for (const file of commandFiles) {
    const commandList = require(`./commands/${file}`);

    for (const ind in commandList.commands)
    {
        const command = commandList.commands[ind];
        client.commands.set(command.name, command);
    }
}

// Check if token was obtained correctly.
if (env.error) throw env.error;

client.once('ready', () =>
{
    console.log('bot is online');
});
client.on('message', message =>
{
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const commandString = args.shift().toLowerCase()
    const command = client.commands.get(commandString);
    if (command !== undefined) command.execute(message, args);

    if (commandString === 'connect')
    {
        async function connect(message)
        {
            if (message.member.voice.channel)
            {
                const connection = await message.member.voice.channel.join()
                                                .then(message.channel.send(`Connected to ${message.member.voice.channel}.`));

                const dispatcher = fixVoiceReceive(connection);

                const userStreams = [];
                message.guild.me.voice.channel.members.forEach(member =>
                                                               {
                                                                  if (member.user.id !== client.user.id)
                                                                  {
                                                                      console.log(`created audio stream for ${member.user}`);
                                                                      const audio = connection.receiver.createStream(member.user, {mode: 'pcm', end: 'manual'});
                                                                      const VR = new voiceRecognition.VoiceRecorder(audio, config.sample_rate_hz);
                                                                      audio.pipe(fs.createWriteStream(`${member.user.id}.wav`));
                                                                      userStreams.push(audio);
                                                                  }
                                                               });
                message.client.voiceConnections.set(message.guild.id, createVoiceConnectionData(connection, dispatcher, userStreams));
            }
            else
            {
                message.channel.send(`<@${message.author.id}> is not connected to a voice channel.`)
            }
        }
        connect(message);
    }
});

// Start the bot
client.login(env.parsed.DISCORD_TOKEN);

function listenTo(user)
{

}
