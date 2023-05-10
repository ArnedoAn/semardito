import { bot, constants } from "../../constants/constants";
import { getUserId } from "../extraFunctions";
import { verifyUser } from "./adminSettings";

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = getUserId(msg);

  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "Ya haces parte de Semard 🤖");
    return;
  }

  let user = {
    telegramId: 0,
    firstName: "",
    lastName: "",
  };

  const msgA = await bot.sendMessage(
    chatId,
    `Hola, soy Semardito.\nIngresa tu nombre y apellido (Juanito Alimaña) para enviaselo al admin 🤖`,
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );

  const respuestaA = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgA.message_id, async (msgA_1) => {
      const names = msgA_1.text!.split(" ");
      user.firstName = names[0];
      user.lastName = names[1];
      resolve();
    });
  });

  await respuestaA;

  bot.sendMessage(chatId, `Gracias ${user.firstName}!`);

  bot.sendMessage(
    constants.adminId!,
    `Hola, soy Semardito. Alguien quiere unirse a Semard:
    \n${user.firstName + " " + user.lastName}: ${userId}`
  );
});
