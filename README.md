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
* When queueing a song, it would queue play the most recently added song. 
** Cause: Using a stack instead of a queue.

# Planned Implementations
* Add a signal to indicate the hotword has been recognized (e.g. ping noise when hotword is heard).
* Allow the ability to listen to multiple users as opposed to one.
* More commands
* etc

# What will not be implemented
* Text Commands associated audio interaction

# Hosting your own voice recognition bot
The voice recognition bot requires google speech to text API key to function the speech to text and discord token for the bot.

If you would like to use my bot, feel free to contact me on Discord (StevenT#4591) and we can discuss.
