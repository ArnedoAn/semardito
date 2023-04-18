import { bot } from "../../constants/constants";
import { verifyUser } from "../admin/adminSettings";
import { getUserId } from "../extraFunctions";
import { EscribirSheet } from "./contabilidad_control_sheet";

bot.onText(/\/money/, async (msg) => {
  const chatId = msg.chat.id;
  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "No te da para tanto 👍");
    return;
  }
  const inputContabilidad = {
    Cantidad: "Por asignar.",
    Descripcion: "Por asignar.",
    Nombre: "Por asignar.",
    Dia: "Por asignar.",
    Mes: "Por asignar.",
    Año: "Por asignar.",
  };

  const msgA = await bot.sendMessage(chatId, "Ingrese la cantidad monetaria:", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Promesa que se resolverá cuando el usuario responda al primer mensaje
  const respuestaA = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgA.message_id, async (msgA_1) => {
      const cantidad = parseFloat(msgA_1.text!);
      inputContabilidad.Cantidad = cantidad.toString();
      resolve();
    });
  });

  await respuestaA;

  const msgB = await bot.sendMessage(chatId, "Razón del dinero:", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Promesa que se resolverá cuando el usuario responda al segundo mensaje
  const respuestaB = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgB.message_id, async (msgB_1) => {
      const descripcion = msgB_1.text!;
      inputContabilidad.Descripcion = descripcion;
      resolve();
    });
  });

  await respuestaB;

  const msgC = await bot.sendMessage(chatId, "Ingrese su nombre:", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Promesa que se resolverá cuando el usuario responda al tercer mensaje
  const respuestaC = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msgC.message_id, async (msgC_1) => {
      const nombreUsuario = msgC_1.text!;
      inputContabilidad.Nombre = nombreUsuario;
      resolve();
    });
  });

  await respuestaC;

  //how to get a date with format dd/mm/yyyy in javascript
  const date = new Date();
  const day = date.getDate();
  inputContabilidad.Dia = day.toString();
  const month = date.getMonth() + 1;
  inputContabilidad.Mes = month.toString();
  const year = date.getFullYear();
  inputContabilidad.Año = year.toString();

  const response = await EscribirSheet(inputContabilidad);

  if (response) {
    await bot.sendMessage(chatId, "Cada vez menos plata 💀 (Todo salió bien)");
  } else {
    await bot.sendMessage(chatId, "Que charada, algo salió mal...");
  }
});
