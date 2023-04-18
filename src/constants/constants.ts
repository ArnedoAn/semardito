import { PrismaClient } from "@prisma/client";
import path from "path";
import * as dotenv from "dotenv";
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
};
