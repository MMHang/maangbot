const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription("test the bot"),
    async execute(client, interaction){
        interaction.reply("it works");
    }
}