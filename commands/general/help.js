const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Info!"),
    async execute(client, interaction){
        await interaction.deferReply()
        const helpbed = new EmbedBuilder()
        .setTitle('Help')
        .addFields({name: 'Levels', value: "You gain 1 exp point from leveling up. The XP threshold for every level is level ^ 3. Note that levels are based on servers, not global. Also, the leaderboard command might take a while to fetch from the database."},
        {name: 'Fun commands', value: 'This is the eightball, fake gift, and ship commands. Eightball does (obviously) an eightball random output, fake gift creates a fake nitro gift, and ship uses an algorithm to evaluate a ship.'},
        {name: "Educational commands", value: 'These commands are for school. The gt command is for getting a GT role so people can ping youw hen help is needed, and the dict command searches a word on wikitionary using the word-definition npm library.'},
        {name: 'Utility commands', value: "The commands are for devs / helping people. Pfp gives a clearer image of a user's profile picture, and /test is to see if the bot is up."})
        .setColor('Blurple')
        .setFooter({text: `Run by ${interaction.user.username}`, avatarURL: interaction.user.avatarURL()})
        .setTimestamp()
        interaction.followUp({embeds: [helpbed]});
    }
}