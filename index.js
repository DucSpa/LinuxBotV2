const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")



//tu token va aqui
const TOKEN = ''

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "720183810364538902"
//tu id de servidor va aqui
const GUILD_ID = ""

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client,{
    ytdlOptions: {
        quality: "highestaudio",
        highWatermark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH){
    const rest = new REST({version:"9"}).setToken(TOKEN)
    console.log("Desplegando slash commands...")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),{body: commands})
    .then(() =>{
        console.log("slash commands desplegados de forma exitosa!")
        process.exit(0)
    })
    .catch((err) =>{
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
} 
else{
    client.on("ready", () => {
        console.log(`Logeado como ${client.user.data}`)
    })
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand())return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Slash comand no valido!")

            await interaction.deferReply()
            await slashcmd.run({client, interaction})
        }
        handleCommand()
    })
    client.login(TOKEN)
}
