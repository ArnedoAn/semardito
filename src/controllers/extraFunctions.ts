import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import path from "path";

const errorLogPath = path.join(process.cwd(), "documents", "errorLog.log");

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