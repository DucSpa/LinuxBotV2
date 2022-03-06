
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Muestra informacion"),
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

		let bar = queue.createProgressBar({
			queue: false,
			length: 20,
		})

		const options = interaction.options._hoistedOptions;
        const user = (options.find((e) => e.name === "user") && options.find((e) => e.name === "user").member.user) || interaction.user;
        const image = user.displayAvatarURL()

        const song = queue.current

		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`:musical_note: Reproduciendo: [${song.title}](${song.url}) :musical_note:  \n\n` + bar + `  ${song.duration}`)
			.setFooter({text:` ${song.title}` ,iconURL: image})
			.setTimestamp()
			.setColor('#b2a89e')
        ],
		})
	},
}
