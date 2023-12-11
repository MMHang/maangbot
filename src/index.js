require("dotenv").config();
var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose');
const level = require('../models/Level')
const { InteractionType, Client, IntentsBitField, ActivityType, Collection, Events, EmbedBuilder } = require('../node_modules/discord.js');


const client = new Client({
    intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildPresences
    ],
});
(async () => {
    await mongoose.connect(process.env.MONGODBURI).then(
        console.log('Connected to the MongoDB database!')
    );
    
})();
client.commands = new Collection();
const foldersPath = path.join('C:/Users/justi/OneDrive/Documents/maangbot', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
function log(filePath, content){
    try {
        fs.appendFileSync(filePath, content);
    } catch(err) {
        console.log(err);
    }
}
client.on('ready', (c) => {
    console.log("Bot's ready!");
    client.user.setActivity({
        name: 'How to legally commit arson',
        type: ActivityType.Watching,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
});
client.on(Events.MessageCreate, async message => {
    if(message.inGuild && !message.author.bot){
        const query = {
            userId: message.author.id,
            guildId: message.guild.id,
        }
        try{
            const Level = await level.findOne(query);
            if (Level) { 
                if (Level.xp >= (Level.level ** 3) - 1){
                    Level.xp = 0
                    Level.level += 1;
                    const levelbed = new EmbedBuilder()
                    .setTitle("Hey " + message.author.username + '!')
                    .setDescription("You leveled up to level " + Level.level + "! Good job!")
                    message.reply({embeds: [levelbed]});
                } else {
                    Level.xp += 1;
                }
                await Level.save()
            } else {
                const newLevel = new level({
                    userId: message.author.id,
                    guildId: message.guild.id,
                    xp: 0,
                });
                await newLevel.save();
            }
        } catch (error){
            console.log(`Error giving exp ${error}`)
        }
    }
})
client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isButton()){
        return;
    }
	if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found. (Autocomplete)`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
    } else if(interaction.isCommand){
            if(!interaction.inGuild()){
                await interaction.reply('This can only be used in a server.');
                return;
            }
            const command = interaction.client.commands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found. (slash command)`);
                return;
            }
    
            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } 
    
	
});
client.login(process.env.TOKEN);
module.exports = { log };
