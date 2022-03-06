const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder().setName("test").setDescription("comando de testeo"),

    run: async( {client,interaction} ) => {
        await interaction.followUp("sus?")
    }
}