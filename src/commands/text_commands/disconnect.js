const {createCommand} = require('../../util.js');

module.exports = createCommand('disconnect',
    'disconnect from author\'s voice channel',
    async message =>
    {
        // Remove from storage
        message.client.voiceConnections.delete(message.guild.id);
        console.log(`deleted entry: ${message.guild.id} from voice connections list.`)
        // Leave server
        await message.guild.me.voice.kick();
    });