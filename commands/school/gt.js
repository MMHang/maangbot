const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('gt')
    .setDescription("Toggle your GT status.")
    .addStringOption(option => option
        .setName('subject')
        .setDescription('The subject to set / remove GT.')
        .setAutocomplete(true)
        .setRequired(true)
        ),
    async autocomplete(interaction){
        const focusedValue = interaction.options.getFocused();
		const choices = ['Science', 'English', 'Geography', 'Math', 'All'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },
    async execute(client, interaction){
        await interaction.deferReply({ephemeral: true})
        const option = interaction.options.getString('subject');
        const roles = await interaction.guild.roles.fetch();
        if(interaction.member.manageable){
            switch(option){
                case 'English':
                    const engrole = roles.find(role => role.name == "GT English");
                    if(interaction.member.roles.cache.has(engrole.id)){
                        interaction.member.roles.remove(engrole);
                        interaction.followUp({ephemeral: true, content: "Done! Removed the GT english role!"})
                    } else {
                        interaction.member.roles.add(engrole);
                        interaction.followUp({ephemeral: true, content: "Done! Added the GT english role!"})
                    }
                    break;
                case 'Science':
                    const scirole = roles.find(role => role.name == "GT Science");
                    if(interaction.member.roles.cache.has(scirole.id)){
                        interaction.member.roles.remove(scirole);
                        interaction.followUp({ephemeral: true, content: "Done! Removed the GT science role!"})
                    } else {
                        interaction.member.roles.add(scirole);
                        interaction.followUp({ephemeral: true, content: "Done! Added the GT science role!"})
                    }
                    break;
                case 'Math':
                    const mathrole = roles.find(role => role.name == "GT Math");
                    if(interaction.member.roles.cache.has(mathrole.id)){
                        interaction.member.roles.remove(mathrole);
                        interaction.followUp({ephemeral: true, content: "Done! Removed the GT math role!"})
                    } else {
                        interaction.member.roles.add(mathrole);
                        interaction.followUp({ephemeral: true, content: "Done! Added the GT math role!"})
                    }
                    break;
                case 'Math':
                    const georole = roles.find(role => role.name == "GT Geography");
                    if(interaction.member.roles.cache.has(georole.id)){
                        interaction.member.roles.remove(georole);
                        interaction.followUp({ephemeral: true, content: "Done! Removed the GT math role!"})
                    } else {
                        interaction.member.roles.add(georole);
                        interaction.followUp({ephemeral: true, content: "Done! Added the GT math role!"})
                    }
                    break;
            }
        } else {
            interaction.followUp({ephemeral: true, content: "Can't lol"})
        }
        
    }
}