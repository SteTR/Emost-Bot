/**
 * Create the function bot here and all the bot controls.
 * Use index.js to start the bot.
 */
const env = require('dotenv').config({path: '../.env'});
const config = require('../config/config.json');
const Discord = require('discord.js');
const fs = require('fs');

const textCommandFiles = fs.readdirSync('./commands/text_commands').filter(file => file.endsWith('.js'));
const voiceCommandFiles = fs.readdirSync('./commands/voice_commands').filter(file => file.endsWith('.js'));

const client = new Discord.Client();
client.textCommands = new Discord.Collection();
client.voiceCommands = new Discord.Collection();
client.voiceConnections = new Discord.Collection();

// add text commands
for (const file of textCommandFiles) {
    const command = require(`./commands/text_commands/${file}`);
    client.textCommands.set(command.name, command)
}

// add voice commands
for (const file of voiceCommandFiles) {
    const command = require(`./commands/voice_commands/${file}`);
    client.voiceCommands.set(command.name, command)
}

// Check if token was obtained correctly.
if (env.error) throw env.error;

client.once('ready', () => {
    // TODO when you disconnect and reconnect, how to readd servers?
    console.log('Voice Recognition Bot is Online');
});

client.on('error', (error) => console.error(error));

// Checks for text commands
client.on('message', message =>
{
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = client.textCommands.get(args.shift().toLowerCase());
    if (command !== undefined) command.execute(message, args);
});

// Disconnects if user has changed channels or disconnects from the voice channel
client.on('voiceStateUpdate', (oldState, newState) =>
{
    if (oldState.channelID !== newState.channelID &&
        client.voiceConnections.find(info => info.listeningTo.id === newState.id))
    {
        client.textCommands.get('disconnect').execute(newState);
    }
});

// client.on('debug', console.log);

console.log('Powering Up Voice Recognition Bot...');

// Start the bot
client.login(env.parsed.DISCORD_TOKEN);
