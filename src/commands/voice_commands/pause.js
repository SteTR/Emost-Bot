const {createCommand} = require('../../util');

module.exports = createCommand(
    'pause',
    'pause the audio playing',
    async (client, guild, args) =>
    {
        const serverInfo = client.voiceConnections.get(guild.id);
        console.log(`Guild ${guild.id}: Pausing ${serverInfo.playing.url}`);
        if (serverInfo.dispatcher === undefined)
        {
            console.log('no dispatcher on this server');
            return;
        }
        serverInfo.dispatcher.pause();
    });