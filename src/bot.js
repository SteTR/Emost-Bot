/**
 * Create the function bot here and all the bot controls.
 * Use index.js to start the bot.
 */
const env = require('dotenv').config({path: '../.env'});
const config = require('../config/config.json');
const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require('ytdl-core');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.serverConnections = new Discord.Collection(); // TODO this could be a refactor

// Re-add any servers that bot is still connected.
// TODO


function createBot()
{
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
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
                message.client.serverConnections.set(message.guild.id, {connection: connection, dispatched: undefined, users: []});
                const currentServerConnection = message.client.serverConnections.get(message.guild.id);

                // Play something to send a opcode 5 payload (apparently a requirement that was not documented)
                // https://github.com/discord/discord-api-docs/issues/808
                const dispatcher =
                    currentServerConnection.dispatched = currentServerConnection.connection
                                                                                .play(ytdl("https://www.youtube.com/watch?v=oFwFw2YvUKY",
                                                                                         {filter: "audioonly", range: {start: 0, end: 5000}}));
                dispatcher.on("start", () => {
                    console.log("Scribe: Play Starting...");
                });
                dispatcher.on("finish", () => {
                    console.log("Scribe: Finished playing!");
                });
                dispatcher.on("end", (end) => {
                    console.log("Scribe: End Finished playing!");
                });

                connection.on('speaking', (user, speaking) => {
                    console.log("dank memes")
                });
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