const {EmbedBuilder, SlashCommandBuilder} = require('discord.js')
const Level = require('../../models/Level');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
(async () => {
    await mongoose.connect(process.env.MONGODBURI)
})();
module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription("Get a leaderboard of the server's user's levels."),
    async execute(client, interaction){
        await interaction.deferReply();
        let leaderboard = ""
        const levels = await Level.aggregate([
            {
                $match: {guildId: interaction.guild.id}
            },
            {
                $sort: {level: -1, xp: -1}
            }
        ])
        for(var i = 0; i < 10; i++){
            username = interaction.guild.members.cache.find(user => user.id === levels[i].userId).user.username
            const level = levels[i].level
            const xp = levels[i].xp
            const place = i + 1
            leaderboard = leaderboard.concat(`${place} - ${username} **${level} - ${xp}/${level ** 3}**`, "\n")
        }
        const userindex = levels.findIndex((obj) => obj.userId === interaction.user.id)
        leaderboard = leaderboard.concat("...\n", `${userindex + 1} - ${interaction.user.username} **${levels[userindex].level} - ${levels[userindex].xp}/${levels[userindex].level ** 3}**`)
        const leaderbed = new EmbedBuilder()
        .setTitle("10 / " + levels.length + " Users (Page 1 / " + Math.ceil(levels.length / 10) + ")")
        .addFields({name: "Leaderboard", value: leaderboard})
        .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
        interaction.followUp({embeds: [leaderbed]});
    }
} 