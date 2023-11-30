const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('pfp')
    .setDescription("Get the pfp of a user")
    .addUserOption(option => option
        .setName('user')
        .setDescription('The user to get the pfp of.')
        .setRequired(true)
        ),
    async execute(client, interaction){
        await interaction.deferReply();
        const user = interaction.options.getUser('user');
        const pfpbed = new EmbedBuilder()
        .setColor('#2B2D31')
        .setImage(user.avatarURL())
        .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
        .setTimestamp();
        interaction.followUp({embeds: [pfpbed]});
    }
}