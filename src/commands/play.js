const {createCommand} = require('../util');
const ytdl = require('ytdl-core');

module.exports = createCommand(
    'play',
    'play a song',
    async (message, args) =>
    {
        const serverInfo = message.client.voiceConnections.get(message.guild.id);
        console.log('playing song')
        // TODO possibly need to change ytdl to find ffmpeg in different folder.
        // TODO also need to separate play into different function so it can be used in diferent way
        serverInfo.dispatched = serverInfo.connection.play(ytdl(args[0], {filter: "audioonly"}));
        serverInfo.dispatched.on("start", () => console.log("song started!"));
        serverInfo.dispatched.on("end", () => console.log("song ended!"));
    })