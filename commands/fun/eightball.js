const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eightball')
    .setDescription('Shake the 8 ball!')
    .addStringOption(option => option
        .setName('question')
        .setDescription('The question to ask.')
        .setRequired(true)),
    async execute(client, interaction){
        await interaction.deferReply();
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const question = interaction.options.getString('question')
        const responseArray = ["Nope. Definitely not.", "Yup, 100%.", "I'm not sure yet.", "Probably?", "Probably not?", "Why do you need to know this?", "It depends."]
        const result = Math.floor(Math.random() * 6)
        const eightbed = new EmbedBuilder()
        .setTitle(question)
        .setDescription('You shake the 8 ball...')
        interaction.followUp({embeds: [eightbed]})
        await sleep(1000);
        eightbed.setDescription(null);
        eightbed.addFields({name: "The 8ball says:", value: responseArray[result]});
        interaction.editReply({embeds: [eightbed]})
    }
}