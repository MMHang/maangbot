const { SlashCommandBuilder, EmbedBuilder, escapeBold } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription("Ship two users")
    .addUserOption(option => option
        .setName('user1')
        .setDescription('The first user to ship.')
        .setRequired(true)
        )
    .addUserOption(option => option
        .setName('user2')
        .setDescription('The second user to ship.')
        .setRequired(true)
        ),
    async execute(client, interaction){
        await interaction.deferReply();
        const regex = new RegExp('/^[a-zA-Z]+$/');
        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');
        let shippower;
        if(!regex.test(user1.username)){
            shippower = Math.floor((user1.username.charCodeAt(1) / 4) * (user2.username.charCodeAt(0) / 6));
        } else {
            shippower = 1100;
        }
        if(shippower > 100){
            shippower = shippower % 100;
        }
        const gaybed = new EmbedBuilder()
        .setTitle(`${user1.username} x ${user2.username} works ${shippower}%`)
        .setColor('#2B2D31')
        .setFooter({text: "Run by " + interaction.user.username, iconURL: interaction.user.avatarURL()})
        .setTimestamp()
        if(shippower <= 20){
            gaybed.setDescription('Absolutely not...')
        } else if (shippower <= 40){
            gaybed.setDescription('If you try, maybe..?')
        } else if (shippower <= 60){
            gaybed.setDescription('Average...')
        } else if (shippower <= 80){
            gaybed.setDescription('Great together!')
        } else if (shippower <= 100){
            gaybed.setDescription('Soulmates!')
        }
        interaction.followUp({embeds: [gaybed]});
    }
}