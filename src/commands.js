require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const commands = [];
const foldersPath = path.join('C:/Users/justi/OneDrive/Documents/DMSGcbot', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application slash commands.`);
		const data = await rest.put(
			Routes.applicationCommands("1174110641401897070"),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application slash commands.`);
	} catch (error) {
		
		console.error(error);
	}
})();