
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Salta a la siguiente cancion"),
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

        const currentSong = queue.current

        const options = interaction.options._hoistedOptions;
        const user = (options.find((e) => e.name === "user") && options.find((e) => e.name === "user").member.user) || interaction.user;
        const image = user.displayAvatarURL()

		queue.skip()
        await interaction.editReply({
            embeds: [new MessageEmbed()
                .setDescription(` :fast_forward:${currentSong.title} ha sido saltada!`)
                .setThumbnail(currentSong.thumbnail)
                .setFooter({text: `${currentSong.title}`, iconURL: image})
                .setTimestamp()
			    .setColor('#b2a89e')
            ]
        })
	},
}