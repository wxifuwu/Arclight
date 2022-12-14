import { PrismaClient } from "@prisma/client";

// ? Create Prisma Client
const prisma = new PrismaClient();

// ? Export Prisma
export { prisma };