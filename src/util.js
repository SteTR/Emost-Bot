// Currently jsut a dump of everything that doesn't belong to other files, TODO need to move to appropriate sections or files.
const ytdl = require('ytdl-core');
const {initial_audio_src} = require('../config/config.json');

function createCommand(name, description, func)
{
    return {name: name, description: description, execute: func};
}

function fixVoiceReceive(connection)
{
    // Play something to send a opcode 5 payload (apparently a requirement that was not documented)
    // https://github.com/discord/discord-api-docs/issues/808
    const dispatcher = connection.play(ytdl(initial_audio_src,
        {filter: "audioonly", range: {start: 0, end: 5000}}));
    dispatcher.on("start", () => {
        console.log("Starting initial audio for payload request");
    });
    dispatcher.on("finish", () => {
        console.log("Finished the initial audio");
        dispatcher.destroy();
    });
    dispatcher.on("end", (end) => {
        console.log("Ended the dispatcher");
    });
    return dispatcher;
}

function createVoiceConnectionData(connection, dispatcher = undefined, voiceRecorderStream = undefined, VoiceRecognition)
{
    return {connection: connection, dispatcher: dispatcher, voiceRecorderStream: voiceRecorderStream, VoiceRecognition: VoiceRecognition};
}

module.exports = {createCommand, fixVoiceReceive, createVoiceConnectionData};