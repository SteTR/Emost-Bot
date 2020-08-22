const {createCommand} = require('../../util');

module.exports = createCommand(
    'resume',
    'resume song',
    (client, guild, args) =>
    {
        console.log('resuming');
        const serverInfo = client.voiceConnections.get(guild.id);
        if (serverInfo.dispatcher === undefined)
        {
            console.log('no dispatcher on this server');
            return;
        }
        if (serverInfo.dispatcher.paused) serverInfo.dispatcher.resume();
    });