const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Info!"),
    async execute(client, interaction){
        await interaction.deferReply()
        const helpbed = new EmbedBuilder()
        .setTitle('Help')
        .setDescription('This is an open source, multi-purpose bot. Check out the Github! https://github.com/MMHang/maangbot')
        .addFields({name: 'Levels', value: "Users gain 1 exp point from sending a message. The XP threshold for every level is level ^ 3. Note that levels are based on servers and are not global."},
        {name: 'Fun commands', value: '**Eightball** \n This command shakes an eightball. What do you expect? \n **Fakegift** \n This command generates a fake nitro gift for a user. \n **Ship** \n Uses a complex algorithm to ship two users. \n **Trivia** \n Generates multiple choice or true or false questions of varying difficulties. Getting it right grants you xp based on the difficulty of the question.'},
        {name: "Educational commands", value: '**GT** \n The GT command is for getting a GT role so people can ping you when help is needed. \n **Dict**\n The dict command searches a word on Wikitionary using the word-definition npm library.'},
        {name: 'Utility commands', value: "The commands are for devs. Just ignore them."})
        .setColor('Blurple')
        .setFooter({text: `Run by ${interaction.user.username}`, avatarURL: interaction.user.avatarURL()})
        .setTimestamp()
        interaction.followUp({embeds: [helpbed]});
    }
}