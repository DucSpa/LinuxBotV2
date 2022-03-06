
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Para el bot y limpia la lista de reproduccion"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue){
            return await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setDescription(`:x:No hay canciones en la lista de reproduccion!`)
                    .setColor('#b2a89e')
                ]
            })
        }

		queue.destroy()
        return await interaction.editReply({
            embeds: [new MessageEmbed()
                .setDescription(`:wave:Saliendo del chat de voz!`)
                .setColor('#b2a89e')
            ]
        })
	},
}