const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
const decoder = require('he')
require("dotenv").config();
const mongoose = require('mongoose');
const level = require('../../models/Level')
async () => {
    await mongoose.connect(process.env.MONGODBURI);
}
module.exports = {
    data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Play some trivia!')
    .addIntegerOption(option => option
        .setName('category')
        .setDescription("Category of the trivia.")
        .addChoices({name: "General", value: 9},
        {name: "Entertainment", value: 10},
        {name: "Science & Nature", value: 17},
        {name: "Computers", value: 18},
        {name: "Math", value: 19},
        {name: "Sports", value: 21},
        {name: "Geography", value: 22},
        {name: "History", value: 23})
        .setRequired(true))
    .addStringOption(option => option
        .setName("difficulty")
        .setDescription("The difficulty of the question.")
        .addChoices({name: "Hard", value: "hard"},
        {name: "Medium", value: 'medium'},
        {name: "Easy", value: 'easy'})),
    async execute(client, interaction){
        await interaction.deferReply();
        let category = interaction.options.getInteger('category');
        if(category === 10){
            category += Math.floor(Math.random() * 5.9);
        }
        const difficulty = interaction.options.getString('difficulty') || null
        let query = 'https://opentdb.com/api.php?amount=1'
        query = query.concat("&category=", category)
        if(difficulty != null){
            query = query.concat('&difficulty=', difficulty);
        }
        console.log(query);
        let question = await fetch(query)
        let data = await question.json();
        while(!data.results || !(data.results.length > 0 )){
            question = await fetch(query)
            data = await question.json();
        }
        let answers = ''
        let correctpos;
        let A
        let B;
        let C;
        let D;
        let yup
        let nope
        let wronganswers = data.results[0].incorrect_answers;
        const thecategory = decoder.decode(data.results[0].category)
        let trivbed = new EmbedBuilder()
            .setTitle("Trivia time!")
            .setDescription(decoder.decode(data.results[0].question))
            .addFields({name: "Category:", value: thecategory, inline: true},
                {name: "Difficulty:", value: data.results[0].difficulty.charAt(0).toUpperCase()
                + data.results[0].difficulty.slice(1), inline: true});
        let row = new ActionRowBuilder();
        if(data.results[0].type === 'multiple'){
            trivbed.addFields({name: "Type:", value: "Multiple-Choice", inline: true})
            correctpos = Math.floor(Math.random() * 3.9)
            for(var i = 0; i < 4; i++){
                if(i === correctpos){
                    answers = answers.concat(String.fromCharCode(i + 65) + ": " + decoder.decode(data.results[0].correct_answer), '\n')
                } else {
                    const wronganswer = wronganswers[Math.floor(Math.random() * (wronganswers.length - .1))];
                    answers = answers.concat(String.fromCharCode(i + 65) + ": " + decoder.decode(wronganswer), '\n')
                    wronganswers.splice(wronganswers.indexOf(wronganswer), 1)
                }
            }
            A = new ButtonBuilder()
			.setCustomId('1')
			.setEmoji('🇦')
			.setStyle(ButtonStyle.Primary)
            B = new ButtonBuilder()
			.setCustomId('2')
			.setEmoji('🇧')
			.setStyle(ButtonStyle.Primary)
            C = new ButtonBuilder()
			.setCustomId('3')
			.setEmoji('🇨')
			.setStyle(ButtonStyle.Primary)
            D = new ButtonBuilder()
			.setCustomId('4')
			.setEmoji('🇩')
			.setStyle(ButtonStyle.Primary)
            row.addComponents(A, B, C, D)
        } else {
            trivbed.addFields({name: "Type", value: "True or false", inline: true})
            answers = answers.concat("True", "\n")
            answers = answers.concat("False", "\n")
            yup = new ButtonBuilder()
			.setCustomId('True')
			.setEmoji('✅')
			.setStyle(ButtonStyle.Primary)
            nope = new ButtonBuilder()
			.setCustomId('False')
			.setEmoji('❌')
			.setStyle(ButtonStyle.Primary)
            row.addComponents(yup, nope)
        }
        trivbed.addFields({name: "Choices:", value: answers})
        let message = await interaction.followUp({embeds: [trivbed], components: [row]});
        const collector = await message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 1000000 })
        collector.on('collect', async i => {
            const query = {
                userId: i.user.id,
                guildId: i.guild.id,
            }
            const Level = await level.findOne(query);
            if(!Level){
                const newLevel = new level({
                    userId: i.user.id,
                    guildId: i.guild.id,
                    xp: 0,
                });
                await newLevel.save();
            }
            await i.deferUpdate()
            console.log(i.customId)
            console.log(data.results[0].correct_answer)
            if(i.customId == "1" || i.customId == "2" || i.customId == "3" || i.customId == "4"){
                A.setDisabled(true);
                B.setDisabled(true);
                C.setDisabled(true);
                D.setDisabled(true);
                console.log(i.customId + correctpos)
                if(parseInt(i.customId) - 1 === correctpos){
                    let newxp;
                    switch (data.results[0].difficulty){
                        case 'easy':
                            newxp = 2
                            break;
                        case 'medium':
                            newxp = 4
                            break;
                        case 'hard':
                            newxp = 8
                            break;
                    }
                    switch(i.customId){
                        case A.data.custom_id:
                            A.setStyle(ButtonStyle.Success)
                            B.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case B.data.custom_id:
                            B.setStyle(ButtonStyle.Success)
                            A.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case C.data.custom_id:
                            C.setStyle(ButtonStyle.Success)
                            B.setStyle(ButtonStyle.Secondary);
                            A.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case D.data.custom_id:
                            D.setStyle(ButtonStyle.Success)
                            B.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            A.setStyle(ButtonStyle.Secondary);
                            break;
                    }
                    Level.streak += 1;
                    await Level.save();
                    const corrbed = new EmbedBuilder()
                    .setTitle("Great Job!")
                    .setDescription(`${i.user.username} got it right and won ${newxp} xp! Their current streak is at **${Level.streak}**. The answer was ${String.fromCharCode(parseInt(i.customId) + 64)}: **${decoder.decode(data.results[0].correct_answer)}**.`)
                    row.setComponents(A, B, C, D)
                    interaction.editReply({embeds: [trivbed, corrbed], components: [row]})
                    
                    try{
                        if (Level.xp >= (Level.level ** 3) - 1){
                            Level.xp = 0
                            Level.level += 1;
                            const levelbed = new EmbedBuilder()
                            .setTitle("Hey " + i.user.username + '!')
                            .setDescription("You leveled up to level " + Level.level + "! Good job!")
                            i.followUp({embeds: [levelbed]});
                        } else {
                            Level.xp += newxp;
                        }
                        await Level.save()
                    } catch (error){
                        console.log(`Error giving exp ${error}`)
                    }
                } else {
                    switch(i.customId){
                        case A.data.custom_id:
                            A.setStyle(ButtonStyle.Danger)
                            B.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case B.data.custom_id:
                            B.setStyle(ButtonStyle.Danger)
                            A.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case C.data.custom_id:
                            C.setStyle(ButtonStyle.Danger)
                            B.setStyle(ButtonStyle.Secondary);
                            A.setStyle(ButtonStyle.Secondary);
                            D.setStyle(ButtonStyle.Secondary);
                            break;
                        case D.data.custom_id:
                            D.setStyle(ButtonStyle.Danger)
                            B.setStyle(ButtonStyle.Secondary);
                            C.setStyle(ButtonStyle.Secondary);
                            A.setStyle(ButtonStyle.Secondary);
                            break;
                    
                    }
                    switch((correctpos + 1).toString()){
                        case A.data.custom_id:
                            A.setStyle(ButtonStyle.Success)
                            break;
                        case B.data.custom_id:
                            B.setStyle(ButtonStyle.Success)
                            break;
                        case C.data.custom_id:
                            C.setStyle(ButtonStyle.Success)
                            break;
                        case D.data.custom_id:
                            D.setStyle(ButtonStyle.Success)
                            break;
                    }
                    Level.streak = 0;
                    await Level.save();
                    const wrongbed = new EmbedBuilder()
                        .setTitle("BZZZZT!")
                        .setDescription(`${i.user.username} got it wrong and lost their streak! The correct answer was ${String.fromCharCode(correctpos + 65)}: **${decoder.decode(data.results[0].correct_answer)}**.`)
                    row.setComponents(A, B, C, D)
                    interaction.editReply({embeds: [trivbed, wrongbed], components: [row]})
                }
            } else {
                if(i.customId == data.results[0].correct_answer){
                    let newxp;
                    switch (data.results[0].difficulty){
                        case 'easy':
                            newxp = 2
                            break;
                        case 'medium':
                            newxp = 4
                            break;
                        case 'hard':
                            newxp = 8
                            break;
                    }
                    switch (i.customId){
                        case yup.data.custom_id:
                            yup.setStyle(ButtonStyle.Success)
                            nope.setStyle(ButtonStyle.Secondary)
                            break;
                        case nope.data.custom_id:
                            nope.setStyle(ButtonStyle.Success)
                            yup.setStyle(ButtonStyle.Secondary)
                    }
                    nope.setDisabled(true)
                    yup.setDisabled(true);
                    Level.streak += 1;
                    await Level.save()
                    const corrbed = new EmbedBuilder()
                    .setTitle("Great Job!")
                    .setDescription(`${i.user.username} got it right and won ${newxp} xp! Their current streak is at **${Level.streak}**. The answer was ${i.customId}.`)
                    row.setComponents(yup, nope);
                    interaction.editReply({embeds: [trivbed, corrbed], components: [row]})
                    try{
                        if (Level.xp >= (Level.level ** 3) - 1){
                            Level.xp = 0
                            Level.level += 1;
                            const levelbed = new EmbedBuilder()
                            .setTitle("Hey " + i.user.username + '!')
                            .setDescription("You leveled up to level " + Level.level + "! Good job!")
                            i.followUp({embeds: [levelbed]});
                        } else {
                            Level.xp += newxp;
                        }
                        await Level.save()
                    } catch (error){
                        console.log(`Error giving exp ${error}`)
                    }
                } else {
                    switch (i.customId){
                        case yup.data.custom_id:
                            yup.setStyle(ButtonStyle.Danger)
                            nope.setStyle(ButtonStyle.Success)
                            break;
                        case nope.data.custom_id:
                            nope.setStyle(ButtonStyle.Danger)
                            yup.setStyle(ButtonStyle.Success)
                    }
                    nope.setDisabled(true)
                    yup.setDisabled(true);
                    Level.streak = 0;
                    await Level.save();
                    const wrongbed = new EmbedBuilder()
                    .setTitle("BZZZZT!")
                    .setDescription(`${i.user.username} got it wrong and lost their streak! The correct answer was ${data.results[0].correct_answer}.`)
                    row.setComponents(yup, nope);
                    interaction.editReply({embeds: [trivbed, wrongbed], components: [row]})
                }
            }
        })
    }
}