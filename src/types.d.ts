// --- Imports ---
import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, Client, ChatInputCommandInteraction, Interaction, ButtonInteraction, GuildMember, APIInteractionGuildMember, Guild, ModalSubmitInteraction } from "discord.js"



// --- Bot Types ---
export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : ChatInputCommandInteraction, client: Client) => void,
    cooldown?: number // in seconds
}

export interface Button {
    id: string,
    execute: (Interaction: ButtonInteraction, client: Client) => void,
    cooldown?: number
}

export interface Modal {
    id: string,
    execute: (Interaction: ModalSubmitInteraction, client: Client) => void,
    cooldown?: number,
}

export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

// --- Data Types ---
export interface logOptions {
    guildID: Guild,
    eventType: "kick" | "ban" | "warn"
    reason: String,
    authorName: String,
}


// --- Other Types ---
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            DATABASE_URL: string,
            REDIS_URL: string,
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        buttons: Collection<string, Button>,
        cooldowns: Collection<string, number>,
        modals: Collection<string, Modal>,
        codes: Collection<string, number>,
    }
}