const {createCommand} = require('../../util');
const ytdl = require('ytdl-core');
const get_yt_url = require('yt-search');

module.exports = createCommand(
    'play',
    'play a song',
    async (client, guild, args) =>
    {
        const serverInfo = client.voiceConnections.get(guild.id);

        const song = args.join(" ");
        console.log(`playing ${song}`);
        const videos = await get_yt_url(song);

        serverInfo.dispatcher = serverInfo.connection.play(ytdl(videos.videos[0].url, {filter: "audioonly"}));
        serverInfo.dispatcher.on("start", () => console.log(`${song} started playing!`));
        serverInfo.dispatcher.on("finish", () => console.log(`${song} has finished playing!`));
        serverInfo.dispatcher.on("end", () => console.log("dispatcher ended!"));
    })