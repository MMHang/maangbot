const {EmbedBuilder, SlashCommandBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('fakenitro')
    .setDescription("Send a user a fake nitro gift.")
    .addUserOption(option => option.
        setName('user')
        .setDescription('The user to send the gift to.')
        .setRequired(true)),
    async execute(client, interaction){
        await interaction.deferReply({ephemeral: true})
        const user = interaction.options.getUser('user')
        const nitrolink = 'https://discord.gift/PZ76qKbfX8G8hjTKUKYjZntk'
        interaction.channel.send(`${user.toString()}, ${interaction.user.username} sent you a nitro gift! Say thanks! ${nitrolink}`);
        interaction.followUp({content: 'Done!', ephemeral: true})
    }
}