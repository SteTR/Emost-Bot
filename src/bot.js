/**
 * Create the function bot here and all the bot controls.
 * Use index.js to start the bot.
 */
const env = require('dotenv').config({path: '../.env'});
const config = require('../config/config.json');
const Discord = require('discord.js');
const fs = require('fs'); // TODO remove
const textCommandFiles = fs.readdirSync('./commands/text_commands').filter(file => file.endsWith('.js'));
const voiceCommandFiles = fs.readdirSync('./commands/voice_commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.voiceConnections = new Discord.Collection(); // TODO this could be a refactor
client.voiceCommands = new Discord.Collection();

// Re-add any servers that bot is still connected.
// TODO

// add commands
for (const file of textCommandFiles) {
    const command = require(`./commands/text_commands/${file}`);
    client.commands.set(command.name, command)
}

for (const file of voiceCommandFiles) {
    const command = require(`./commands/voice_commands/${file}`);
    client.voiceCommands.set(command.name, command)
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
    const command = client.commands.get(args.shift().toLowerCase());
    if (command !== undefined) command.execute(message, args);
});

console.log('starting bot')
// Start the bot
client.login(env.parsed.DISCORD_TOKEN);

function listenTo(user)
{

}
