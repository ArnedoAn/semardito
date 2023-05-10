import { bot, constants } from "../../constants/constants";
import { getUserId } from "../extraFunctions";
import { addUser } from "./adminSettings";

bot.onText(/\/newuser/, async (msg) => {
  const chatId = msg.chat.id;
  let user = {
    telegramId: 0,
    firstName: "",
    lastName: "",
  };
  const userId = getUserId(msg);
  if (userId?.toString() != constants.adminId) {
    bot.sendMessage(chatId, "No tienes permiso para usar este comando");
    return;
  }
  const msgA = await bot.sendMessage(
    chatId,
    "Ingrese nombre y apellido (Juanito Alimaña):",
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );

  // Promesa que se resolverá cuando el usuario responda al primer mensaje
  const respuestaA = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgA.message_id, async (msgA_1) => {
      const names = msgA_1.text!.split(" ");
      user.firstName = names[0];
      user.lastName = names[1];
      resolve();
    });
  });

  await respuestaA;

  const msgB = await bot.sendMessage(chatId, "Ingrese el ID de Telegram:", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Promesa que se resolverá cuando el usuario responda al segundo mensaje
  const respuestaB = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgB.message_id, async (msgB_1) => {
      user.telegramId = parseInt(msgB_1.text!);
      resolve();
    });
  });

  await respuestaB;

  if (await addUser(user)) {
    await bot.sendMessage(chatId, "Usuario agregado con éxito");
  } else {
    await bot.sendMessage(chatId, "Error al agregar usuario");
  }
});
