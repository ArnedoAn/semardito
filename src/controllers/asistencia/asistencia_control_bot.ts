import { EscribirSheet } from "./asistencia_control_sheet";
import { bot } from "../../constants/constants";
import { getDateString, getUserId } from "../extraFunctions";
import { verifyUser } from "../admin/adminSettings";

// Obtener dia actual
// const date = new Date();
// const opciones: Intl.DateTimeFormatOptions = { weekday: "long" };
// const diaActual = new Intl.DateTimeFormat("es-CO", opciones).format(date);

console.log("Funcionando");
bot.onText(/\/asistencia/, async (msg) => {
  const chatId = msg.chat.id;
  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "No te da para tanto 👍");
    return;
  }

  // if (diaActual === "martes" || diaActual === "viernes") {
  // const chatId = msg.chat.id;
  const InputAsistencia = {
    Nombre: "",
    Fecha: "Por asignar.",
    Hora: "Por asignar."
  };

  const msg1 = await bot.sendMessage(chatId, "Ingrese su nombre completo:", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Promesa que se resolverá cuando el usuario responda al primer mensaje
  const respuesta1 = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msg1.message_id, async (msg1_1) => {
      const nombre = msg1_1.text!;
      InputAsistencia.Nombre = nombre;
      resolve();
    });
  });

  await respuesta1;

  let fecha = getDateString()

  InputAsistencia.Fecha = fecha[0];
  InputAsistencia.Hora = fecha[1];


  const response = await EscribirSheet(InputAsistencia);

  if (response) {
    await bot.sendMessage(chatId, "Si señor, pura gente responsable 👍");
  } else {
    await bot.sendMessage(chatId, "Ya nos hackearon, algo salió mal...");
  }
  // } else {
  //   bot.sendMessage(chatId, "Lo sentimos pero no es dia de asistencia 💀");
  // }
});
