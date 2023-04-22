import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { constants } from "../constants/constants";

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

export const getDateString = (): string[] => {
  //how to get a date with format dd/mm/yyyy in javascript
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const fecha = `${day}/${month}/${year}`;
  const hora = `${hour}:${minute}:${second}`;

  return [fecha, hora]
}
