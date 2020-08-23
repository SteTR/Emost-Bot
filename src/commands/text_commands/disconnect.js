const {createCommand} = require('../../util.js');

module.exports = createCommand('disconnect',
    'disconnect from author\'s voice channel',
    async message =>
    {
        const serverInfo = message.client.voiceConnections.get(message.guild.id);

        // leave the server
        serverInfo.disconnect();

        // Remove from storage
        serverInfo.delete(message.guild.id);

        console.log(`deleted entry: ${message.guild.id} from voice connections list.`)
    });