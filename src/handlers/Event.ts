// --- Imports ---
import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../types";
import { logger } from "../helpers/logger"


// --- Event Handler ---
module.exports = (client: Client) => {
    let eventsDir = join(__dirname, "../events")
    let eventNames : String[] = [];

    // -- File Loader --
    readdirSync(eventsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let event: BotEvent = require(`${eventsDir}/${file}`).default
        eventNames.push(event.name)
        event.once ?
            client.once(event.name, (...args) => event.execute(...args, client))
            :
            client.on(event.name, (...args) => event.execute(...args, client))
    })

    logger.startup(`Successfully loaded ${eventNames.length} events!`)
}
