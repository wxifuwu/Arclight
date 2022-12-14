// --- Imports ---
import { Client, Collection, PermissionFlagsBits,} from "discord.js";
const client = new Client({ intents: 3276799 });
import { Button, Modal, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
config()


// --- Client Collections ---
client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>();
client.buttons = new Collection<string, Button>();
client.modals = new Collection<string, Modal>();
client.codes = new Collection<string, number>();

// --- Require Handlers ---
const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
})


// --- Login ---
client.login(process.env.TOKEN);