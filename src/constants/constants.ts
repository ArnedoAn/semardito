import { PrismaClient } from "@prisma/client";
import path from "path";
import * as dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config();

export const constants = {
  telegramToken: process.env.TELEGRAM_TOKEN,
  adminId: process.env.ADMIN_ID,
  logFilePath: path.join(
    process.cwd(),
    process.env.LOGFILE_PATH || "documents",
    process.env.LOGFILE_NAME || "errorLog.log"
  ),
  prisma: new PrismaClient(),
  port: process.env.PORT || 3001,
};

export const bot = new TelegramBot(constants.telegramToken!, {
  polling: true,
});

export const credenciales = require("../../key.json");
