# Emost-Bot
Emost-Bot is a music bot for discord using only voice commands. It will listen to only one person who types the {prefix}connect command in a text channel. The bot works in a similar manner to the voice assistant on modern phones.

# Text Commands(default prefix: !)
* connect
* disconnect

# Voice Commands (default hotword: bumblebee)
* play {song name}
* skip
* pause
* resume

# Known Issues
* None that I'm aware of but have mainly tested with one server, not multiple

# Planned Implementations
* Add a signal to indicate the hotword has been recognized (e.g. ping noise when hotword is heard).
* Allow the ability to listen to multiple users as opposed to one.
* More commands
* etc

# What will not be implemented
* Text Commands associated audio interaction

# Hosting your own voice recognition bot
The voice recognition bot requires google speech to text API key to function the speech to text and discord token for the bot.

If you would like to use Emost bot and not have to host you own, feel free to contact me on Discord (StevenT#4591) and we can discuss.

# Concerns with recording
The bot will record audio of the person typing !connect for hotword and speech detection purposes. The bot itself does not collect any data but uses Picovoice's Porcupine wake word engine and Google's Speech to Text API w/o Data Logging. 

If you are not comfortable with what the bot is doing, please use !disconnect. 

This only applies to Emost-Bot, any other bot with similar features may be collecting data that I have no control of.

If you would like to view the source code, here is the repository link: https://github.com/stetr/emost-bot
*Copy pasted from config.json
