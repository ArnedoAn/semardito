import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { constants } from "../constants/constants";

const prisma = constants.prisma;
const errorLogPath = constants.logFilePath;

export async function logError(error: Error): Promise<void> {
  const logMessage = `${new Date().toISOString()}: ${error.message}\n`;
  try {
    if (!fs.existsSync(errorLogPath)) {
      await fs.promises.writeFile(errorLogPath, "");
    }
    await fs.promises.appendFile(errorLogPath, logMessage);
    console.log("Mensaje de registro guardado con éxito");
  } catch (error) {
    console.error("Error al escribir en el archivo de registro", error);
  }
}

export const getUserId = (msg: TelegramBot.Message) => {
  return msg.from?.id;
};

export const getUserName = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      telegramId: id,
    },
  });

  return `${user?.firstName} ${user?.lastName}` || "Usuario desconocido";
};
