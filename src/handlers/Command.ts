// --- Imports --- 
import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import { join } from "path";
import { Command, SlashCommand } from "../types";
import { logger } from "../helpers/logger";


// --- Command Handler ---
module.exports = (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []
    const commands : Command[] = []

    let slashCommandsDir = join(__dirname,"../slashCommands")
    let commandsDir = join(__dirname,"../commands")

    // -- Slash Command Loader --
    readdirSync(slashCommandsDir).forEach(dir => {
        let directory: string = join(__dirname, `../slashCommands/${dir}`)
        readdirSync(directory).forEach(file => {
            if (!file.endsWith(".js")) return;
            let command : SlashCommand = require(`${directory}/${file}`).default
    
            slashCommands.push(command.command)
            client.slashCommands.set(command.command.name, command)
        })
    })

    // -- Text Command Loader --
    readdirSync(commandsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let command : Command = require(`${commandsDir}/${file}`).default
        commands.push(command)
        client.commands.set(command.name, command)
    })

    // -- Deploy Commands --
    const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        logger.startup(`Successfully loaded ${data.length} slash commands!`)
        logger.startup(`Successfully loaded ${commands.length} commands!`)
    }).catch(e => {
        logger.error(e)
    })
}