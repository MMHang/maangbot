const { SlashCommandBuilder, EmbedBuilder, Attachment, AttachmentBuilder } = require('discord.js');
const Level = require('../../models/Level');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Rank } = require('canvacord');
(async () => {
    await mongoose.connect(process.env.MONGODBURI)
})();
module.exports = {
    data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Get the profile of a user with info about them.")
    .addUserOption(option => option
        .setName('user')
        .setDescription("The user. (keep empty if you'd like to get info from yourself).")),
    async execute(client, interaction){
        await interaction.deferReply()
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user)
        const fetchedLevel = await Level.findOne({
            guildId: interaction.guild.id,
            userId: member.id,
        })
        const profilebed = new EmbedBuilder()
        .setTitle(`${user.username}'s profile`)
        .addFields({name: `Joined discord:`, value: "`" + new Date(user.createdTimestamp).toLocaleDateString() + "`", inline: true}
        , {name: `Joined this server:`, value: "`" + new Date(member.joinedTimestamp).toLocaleDateString() + "`", inline: true}
        , {name: `Number of roles:`, value: "`" + `${Array.from(member.roles.cache).length - 1}` + "`", inline: true}
        , {name: `Role w/ highest position:`, value: "`" + `${member.roles.highest.name}` + "`", inline: true}
        , {name: `Current trivia streak:`, value: "`" + `${fetchedLevel.streak}` + "`", inline: true})
        .setFooter({text: `Run by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()})
        .setTimestamp()
        if(member.presence?.status == null){
            profilebed.addFields({name: "Status:", value: "`offline`", inline: true})
        } else {
            profilebed.addFields({name: "Status:", value: "`" + member.presence?.status + "`", inline: true})
        }
        if(!member.presence?.activities || member.presence.activities?.length == 0){
            profilebed.addFields({name: `Activity:`, value: "`Currently doing nothing as of right now.`", inline: true})
        } else {
            const activity = member.presence?.activities[0];
            if(activity.type == 0){
                profilebed.addFields({name: `Activity:`, value: "`Playing " + activity.name + "`", inline: true});
            } else if (activity.type == 1){
                profilebed.addFields({name: `Activity:`, value: "`Streaming " + activity.name + "`", inline: true});
            } else if (activity.type == 2){
                profilebed.addFields({name: `Activity:`, value: "`Listening to " + activity.name + "`", inline: true});
            } else if (activity.type == 3){
                profilebed.addFields({name: `Activity:`, value: "`Watching " + activity.name + "`", inline: true});
            } else if (activity.type == 4){
                profilebed.addFields({name: `Activity:`, value: "`This user has a custom status.`", inline: true});
            } else if (activity.type == 5){
                profilebed.addFields({name: `Activity:`, value: "`Competing in " + activity.name + "`", inline: true});
            }
        }
        interaction.followUp({embeds: [profilebed]})
        if (fetchedLevel) {
            const rankcanvas = new Rank()
            .setAvatar(user.displayAvatarURL({ forceStatic: true}))
            .setLevel(fetchedLevel.level, "Level")
            .setRank(1, "Rank", false)
            .setCurrentXP(fetchedLevel.xp, '#fff')
            .setRequiredXP(fetchedLevel.level ** 3)
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            await rankcanvas.build().then(data => {
                const attachment = new AttachmentBuilder(data, 'rank.png')
                interaction.editReply({embeds: [profilebed], files: [attachment]});
            });
        }
    }
}