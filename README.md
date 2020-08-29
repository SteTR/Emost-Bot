# Emost-Bot
Emost-Bot is a music bot for discord using only voice commands. It will listen to only one person who types the {prefix}connect command in a text channel. The bot works in a similar manner to the voice assistant on modern phones.

**There needs to be a very small delay (~0.5s) in order for the bot to start listening for the command. So say 'bumblebee...pause' rather than 'bumblebee pause'.**

# Text Commands(default prefix: !)
* connect - connect to the voice channel that the user is in
* disconnect - disconnect from the voice channel that it was in (will auto disconnect if a user disconnects from the voice channel)

# Voice Commands (default hotword: bumblebee)
* play {song name} - play {song name} or add the {song name} to the queue if a song is currently playing
* skip - skip the current song playing
* pause - pause the current song
* resume - resume the current song

# Known Issues
* Occasionally, porcupine will fail to initialize due to sensitivity range issues (unsure why)
* No significant issues when mainly using in one server, possibly with multiple servers at once there will be issues

# Planned Implementations(TBD)
* Add a signal to indicate the hotword has been recognized (e.g. ping noise when hotword is heard)
* Allow the ability to listen to multiple users as opposed to one
* More commands
* Faster and offline speech to text 

# What will not be implemented
* Text Commands associated audio interaction

# Hosting your own voice recognition bot
Requirements:
* Google's Speech to Text API key
* Discord Bot Token


1. To run the bot: clone the repository
```git clone https://github.com/SteTR/Emost-Bot.git``` or by clicking the "Code" button and download

2. Run ```npm install``` in the directory with your preferred CLI to install dependencies

3. Create a .env file in the project's directory and put DISCORD_TOKEN={YOUR DISCORD BOT TOKEN HERE WITHOUT CURLY BRACES}

4. Make the environment variable for Google's Speech to Text API key by typing ```export GOOGLE_APPLICATION_CREDENTIALS="{PATH TO GOOGLE KEY WITHOUT CURLY BRACES}```

5. go to the src directory and run ```node bot.js``` and your bot should be running.

**Have only tested on Linux, no idea if it will work on Windows or Mac due to some dependencies not working on those platforms.**

# Concerns with recording
The bot will record audio of the person typing !connect for hotword and speech detection purposes. The bot itself does not collect any data but uses Picovoice's Porcupine wake word engine and Google's Speech to Text API w/o Data Logging. 

If you are not comfortable with what the bot is doing, please use !disconnect. 

This only applies to Emost-Bot, any other bot with similar features may be collecting data that I have no control of.

If you would like to view the source code, here is the repository link: https://github.com/stetr/emost-bot

*Copy pasted from config.json*
