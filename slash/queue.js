
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra las canciones de la lista de reproduccion")
    .addNumberOption((option) => option.setName("page").setDescription("Numero de la pagina de la lista").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        
        const options = interaction.options._hoistedOptions;
        const user = (options.find((e) => e.name === "user") && options.find((e) => e.name === "user").member.user) || interaction.user;
        const image = user.displayAvatarURL()

        if (!queue || !queue.playing){
            return await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setDescription(`:x:No hay canciones en la lista de reproduccion!`)
                    .setColor('#b2a89e')
                ]
            })
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) {
            return await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setDescription(`:x:Pagina invalida! hay un total de ${totalPages} de paginas de canciones`)
                    .setColor('#b2a89e')
                ]
            })
        }
            
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Reproduciendo: **\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "none ") +
                    `\n\n**Lista**\n${queueString}`
                    )
                    .setFooter({
                        text: `Pagina ${page + 1} de ${totalPages}`, iconURL: image
                    })
                    .setTimestamp()
                    .setThumbnail(currentSong.setThumbnail)
                    .setColor('#b2a89e')
            ]
        })
    }
}