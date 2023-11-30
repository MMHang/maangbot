const { EmbedBuilder, SlashCommandBuilder, Options } = require("discord.js");
const wd = require("word-definition")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('dict')
    .setDescription("Search up a term on the dictionary!")
    .addStringOption(option => option
        .setName("query")
        .setDescription('What to search for.')
        .setRequired(true)),
    async execute (client, interaction){
        await interaction.deferReply();
        const word = interaction.options.getString("query")
        wd.getDef(word, "en", null, function(definition){
            if(definition.category && definition.definition){
                const wordbed = new EmbedBuilder()
                .setTitle('Definition of *' + definition.word + '*')
                .setDescription(`*${definition.category}* \n ${definition.definition}`)
                .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
                .setTimestamp()
                .setColor('#2B2D31');
                interaction.followUp({embeds: [wordbed]});
            } else {
                const wordbed = new EmbedBuilder()
                .setTitle("*" + word + "* isn't in the dictionary.")
                .setDescription(`Did you misspel it?`)
                .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
                .setTimestamp()
                .setColor('#2B2D31');
                interaction.followUp({embeds: [wordbed]})
            }

        })
    }
}