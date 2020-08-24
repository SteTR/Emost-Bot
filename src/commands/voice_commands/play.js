const {createCommand} = require('../../util');
const ytdl = require('ytdl-core-discord');
const get_yt_url = require('yt-search');

module.exports = createCommand(
    'play',
    'play a song',
    play);
async function play(client, guild, args)
{

    const serverInfo = client.voiceConnections.get(guild.id);
    if (args.length === 0) return serverInfo.textChannel.send("Did not receive any song when attemping 'play'");
    const song = args.join(" ");

    const videos = await get_yt_url(song);
    // if (!serverInfo.dispatcher /*||*/ /* tempFix *//*!serverInfo.playing*/)
    // {
        serverInfo.textChannel.send(`Playing the song: ${videos.videos[0].title}`);
        serverInfo.playing = {name: videos.videos[0].title,
            url: videos.videos[0].url,
            stream: await ytdl(videos.videos[0].url, {highWaterMark: 1 << 25})};
        serverInfo.dispatcher = serverInfo.connection.play(await ytdl(videos.videos[0].url, {highWaterMark: 1 << 25}),{type: 'opus'});
        serverInfo.dispatcher.on("start", () => console.log(`${videos.videos[0].title} started playing!`));
        serverInfo.dispatcher.on("finish", () =>
        {
            // if (serverInfo.queue.length === 0)
            // {
            //     serverInfo.playing = undefined;
            //     return;
            // }
            // play(client, guild, serverInfo.queue.pop());
        });
        serverInfo.dispatcher.on("end", () => console.log("dispatcher ended!"));
    // }
    // else
    // {
    //     serverInfo.textChannel.send(`A song is already playing. Queuing the query: ${videos.videos[0].url}`);
    //     serverInfo.queue.push(args);
    // }
}