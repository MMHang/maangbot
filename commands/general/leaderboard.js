const {EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType} = require('discord.js')
const Level = require('../../models/Level');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
(async () => {
    await mongoose.connect(process.env.MONGODBURI)
})();
module.exports = {
    data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription("Get a leaderboard of the server's user's levels.")
    .addIntegerOption(option => option
        .setName("size")
        .setDescription('The amount of people you want to see per page.')),
    async execute(client, interaction){
        await interaction.deferReply();
        let leaderboard = ""
        let currentPage = 0
        const usersperpage = interaction.options.getInteger('size') || 10;
        const levels = await Level.aggregate([
            {
                $match: {guildId: interaction.guild.id}
            },
            {
                $sort: {level: -1, xp: -1}
            }
        ])
        let userin = false;
        for(var i = currentPage * usersperpage; i < usersperpage; i++){
            if(i + (usersperpage * currentPage) > levels.length){
                break;
            }
            username = interaction.guild.members.cache.find(user => user.id === levels[i].userId).user.username
            const level = levels[i].level
            const xp = levels[i].xp
            const place = i + 1
            if(levels[i].userId === interaction.user.id){
                userin = true
                leaderboard = leaderboard.concat(`${place} - ${username} **${level} - ${xp}/${level ** 3}** :arrow_backward:`, "\n")
            } else {
                leaderboard = leaderboard.concat(`${place} - ${username} **${level} - ${xp}/${level ** 3}**`, "\n")
            }
            
        }
        if(!userin){
            const userindex = levels.findIndex((obj) => obj.userId === interaction.user.id)
            leaderboard = leaderboard.concat("...\n", `${userindex + 1} - ${interaction.user.username} **${levels[userindex].level} - ${levels[userindex].xp}/${levels[userindex].level ** 3}**`)
        }
        
        const leaderbed = new EmbedBuilder()
        .setTitle(((currentPage * usersperpage) + usersperpage) + " / " + levels.length + " Users (Page 1 / " + Math.ceil(levels.length / usersperpage) + ")")
        .addFields({name: "Leaderboard", value: leaderboard})
        .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
        const next = new ButtonBuilder()
			.setCustomId('next')
			.setEmoji('➡️')
			.setStyle(ButtonStyle.Primary);
		const previous = new ButtonBuilder()
			.setCustomId('previous')
			.setEmoji('⬅️')
			.setStyle(ButtonStyle.Primary)
            .setDisabled(true);
            if(currentPage <= 0){
                previous.setDisabled(true);
            } else {
                previous.setDisabled(false);
            }
            if(currentPage >= Math.ceil(levels.length / usersperpage)){
                next.setDisabled(true);
            } else {
                next.setDisabled(false);
            }
        const row = new ActionRowBuilder()
		    .addComponents(previous, next);
        let message = await interaction.followUp({embeds: [leaderbed], components: [row]});
        let collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
        collector.on('collect', async i => {
            await i.deferUpdate();
            leaderboard = ''
            if (i.user.id === interaction.user.id) {
                if(i.customId == 'next'){
                    currentPage++;
                } else {
                    currentPage--;
                }
                for(let j = (currentPage * usersperpage); j < usersperpage * currentPage + usersperpage; j++){
                    if(j >= levels.length){
                        break;
                    }
                    username = interaction.guild.members.cache.find(user => user.id === levels[j].userId).user.username
                    const level = levels[j].level
                    const xp = levels[j].xp
                    const place = j + 1
                    if(levels[j].userId === interaction.user.id){
                        userin = true
                        leaderboard = leaderboard.concat(`${place} - ${username} **${level} - ${xp}/${level ** 3}** :arrow_backward:`, "\n")
                    } else {
                        leaderboard = leaderboard.concat(`${place} - ${username} **${level} - ${xp}/${level ** 3}**`, "\n")
                    }
                    
                }
                if(currentPage <= 0){
                    previous.setDisabled(true);
                } else {
                    previous.setDisabled(false);
                }
                if(currentPage + 1 >= Math.ceil(levels.length / usersperpage)){
                    next.setDisabled(true);
                } else {
                    next.setDisabled(false);
                }
                const row = new ActionRowBuilder()
		            .addComponents(previous, next);
                let leaderbed = new EmbedBuilder()
                    .setTitle(((currentPage * usersperpage) + usersperpage) + " / " + levels.length + ` Users (Page ${currentPage + 1} / ` + Math.ceil(levels.length / usersperpage) + ")")
                    .addFields({name: "Leaderboard", value: leaderboard})
                    .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
                if(((usersperpage * currentPage) + usersperpage) >= levels.length){
                    leaderbed.setTitle(levels.length + " / " + levels.length + ` Users (Page ${currentPage + 1} / ` + Math.ceil(levels.length / usersperpage) + ")")
                }
                message = await interaction.editReply({embeds: [leaderbed], components: [row]});
                collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 15000 });
            } else {
                i.followUp({ content: `These buttons aren't for you!`, ephemeral: true });
            }
            
        });

    }
}