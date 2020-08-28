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
    if (args.length === 0) return serverInfo.textChannel.send("Did not receive any song argument when attempting 'play'");
    const song = args.join(" ");

    const videos = await get_yt_url(song);
    const songInfo = {
        title: videos.videos[0].title,
        url: videos.videos[0].url,
        stream: await ytdl(videos.videos[0].url, {highWaterMark: 1 << 25})};
    if (!serverInfo.dispatcher) realPlay(serverInfo, guild, songInfo);
    else
    {
        serverInfo.textChannel.send(`A song is already playing. Queuing the query: ${songInfo.url}`);
        console.log(`Guild ${guild.id}: Adding ${songInfo.url} to queue`);
        serverInfo.queue.push(songInfo);
    }
}

function realPlay(serverInfo, guild, songInfo)
{
    serverInfo.playing = songInfo;

    serverInfo.textChannel.send(`Playing ${serverInfo.playing.url}`);
    console.log(`Guild ${guild.id}: Playing ${serverInfo.playing.url}`);

    serverInfo.dispatcher = serverInfo.connection.play(serverInfo.playing.stream,{type: 'opus'});
    serverInfo.dispatcher.on("start", () => console.log(`Guild ${guild.id}: ${serverInfo.playing.url} started playing`));
    serverInfo.dispatcher.on("finish", () =>
    {
        console.log(`Guild ${guild.id}: ${serverInfo.playing.url} finished playing`);
        if (serverInfo.queue.length === 0)
        {
            serverInfo.playing.stream.destroy();
            serverInfo.playing = undefined;
            serverInfo.dispatcher.destroy();
            serverInfo.dispatcher = undefined;
            return;
        }
        realPlay(serverInfo, guild, serverInfo.queue.shift());
    });
    serverInfo.dispatcher.on("end", () => console.log(`Guild ${guild.id}: Song dispatcher ended`));
}
