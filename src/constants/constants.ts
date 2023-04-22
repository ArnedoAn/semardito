import { PrismaClient } from "@prisma/client";
import path from "path";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config();

export const constants = {
  telegramToken: process.env.TELEGRAM_TOKEN,
  adminId_a: process.env.ADMIN_ID_A,
  adminId_j: process.env.ADMIN_ID_J,
  logFilePath: path.join(
    process.cwd(),
    process.env.LOGFILE_PATH || "documents",
    process.env.LOGFILE_NAME || "errorLog.log"
  ),
  prisma: new PrismaClient(),
};

export const bot = new TelegramBot(constants.telegramToken!, {
  polling: true,
});

export const credenciales = require("../../key.json");
