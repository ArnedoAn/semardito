import { EscribirSheet } from "./asistencia_control_sheet";
import { bot } from "../../constants/constants";
import { getUserId } from "../extraFunctions";
import { verifyUser } from "../admin/adminSettings";

// Obtener dia actual
const date = new Date();
const opciones: Intl.DateTimeFormatOptions = { weekday: "long" };
const diaActual = new Intl.DateTimeFormat("es-ES", opciones).format(date);

console.log("Funcionando");
bot.onText(/\/asistencia/, async (msg) => {
  const chatId = msg.chat.id;
  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "No te da para tanto 👍");
    return;
  }
  console.log(diaActual)
  if (diaActual === "martes" || diaActual === "viernes") {
    const chatId = msg.chat.id;
    const InputAsistencia = {
      Nombre: "",
      Dia: "Por asignar. ",
      Mes: "Por asignar.",
      Año: "Por asignar.",
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

    //how to get a date with format dd/mm/yyyy in javascript
    const date = new Date();
    const day = date.getDate();
    InputAsistencia.Dia = day.toString();
    const month = date.getMonth() + 1;
    InputAsistencia.Mes = month.toString();
    const year = date.getFullYear();
    InputAsistencia.Año = year.toString();
    // const fecha = `${day}/${month}/${year}`;

    const response = await EscribirSheet(InputAsistencia);

    if (response) {
      await bot.sendMessage(chatId, "Si señor, pura gente responsable 👍");
    } else {
      await bot.sendMessage(chatId, "Ya nos hackearon, algo salió mal...");
    }
  } else {
    bot.sendMessage(chatId, "Lo sentimos pero no es dia de asistencia 💀");
  }
});
