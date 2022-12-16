import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { logger } from "./logger";

// ? Create Prisma Client
const prisma = new PrismaClient();

// ? Create and Connect Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => {
    logger.error(`Redis Error: ${err}`);
})

connect();

// ? Export
export { prisma, redisClient };



async function connect() {
    await redisClient.connect();
}