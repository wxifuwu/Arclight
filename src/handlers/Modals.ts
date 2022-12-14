// --- Imports ---
import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { logger } from "../helpers/logger";
import { Modal } from "../types";


// --- Handler ---
module.exports = (client: Client) => {
    let modalsDir: string = join(__dirname, "../modals");

    // -- File Loader --
    readdirSync(modalsDir).forEach(dir => {
        let directory: string = join(__dirname, `../modals/${dir}`);

        readdirSync(directory).forEach(file => {
            if(!file.endsWith("js")) return;
            let modal: Modal = require(`${directory}/${file}`).default

            client.modals.set(modal.id, modal);
        })
    })

    logger.startup(`Successfully loaded ${client.modals.size} Modals!`)
}