const ytdl = require('ytdl-core');
const fs = require('fs');
function createCommand(name, description, func)
{
    return {name: name, description: description, execute: func};
}

module.exports =
    {
      commands:
          [/*createCommand('connect',
                         'connect to author\'s voice channel',

                         }),*/
           createCommand('disconnect',
                         'disconnect from author\'s voice channel',
                         async message =>
                         {
                             await message.guild.me.voice.kick();
                         }),
          createCommand('play',
                    'play a song',
                                async (message, args) =>
                        {
                            const serverInfo = message.client.voiceConnections.get(message.guild.id);
                            console.log('playing song')
                            // TODO possibly need to change ytdl to find ffmpeg in different folder.
                            serverInfo.dispatched = serverInfo.connection.play(ytdl(args[0], {filter: "audioonly"}));
                            serverInfo.dispatched.on("start", () => console.log("song started!"));
                            serverInfo.dispatched.on("end", () => console.log("song ended!"));
                        }),
          createCommand('kill', 'ends the bot', async (message) => message.client.destroy())]
    };