const {createCommand} = require('../../util');

module.exports = createCommand(
    'skip',
    'skips a song currently playing',
    (client, guild, args) =>
    {
        console.log(`Guild ${guild.id}: Skipping Song`);
        client.voiceCommands.get('pause').execute(client, guild, args);
        const serverInfo = client.voiceConnections.get(guild.id);
        serverInfo.dispatcher.emit('finish');
    }
)