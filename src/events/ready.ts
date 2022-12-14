import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { logger } from "../helpers/logger";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {
        logger.success(`Logged in as ${client.user?.username}`);
        client.user?.setPresence({
            activities: [
                {
                    name: `to ${process.env.PREFIX}help`,
                    type: ActivityType.Listening
                }
            ],
            status: "dnd"
        })
    }
}

export default event;