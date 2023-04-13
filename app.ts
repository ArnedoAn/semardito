import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import TelegramBot from "node-telegram-bot-api";
import toContabilidad from "./routes/contabilidad";
import toAsistencia from "./routes/asistencia";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, {
  polling: true,
});

// Ubicación del archivo de hoja de cálculo
const archivoContabilidad = path.join(
  process.cwd(),
  "documents",
  "contabilidad.xlsx"
);

const archivoAsistencia = path.join(
  process.cwd(),
  "documents",
  "asistencia.xlsx"
);

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "Bienvenido al bot de Semard. Tenga en cuenta que su uso es exclusivo para el grupo de Semard. Si desea conocer los comandos disponibles, por favor, escriba /help"
  );
});

bot.onText(/\/out/, async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  bot.sendMessage(chatId, "Por favor, ingrese la cantidad monetaria:");
});

bot.onText(/\/money/, async (msg) => {
  const chatId = msg.chat.id;
  const inputContabilidad = {
    cantidad: 0,
    descripcion: "Por asignar (?)",
    nombreUsuario: "Por asignar (?)",
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
      inputContabilidad.cantidad = cantidad;
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
      inputContabilidad.descripcion = descripcion;
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
      inputContabilidad.nombreUsuario = nombreUsuario;
      resolve();
    });
  });

  await respuestaC;

  const response = await toContabilidad(inputContabilidad, archivoContabilidad);

  if (response) {
    await bot.sendMessage(chatId, "Cada vez menos plata 💀 (Todo salió bien)");
  } else {
    await bot.sendMessage(chatId, "Que charada, algo salió mal...");
  }
});

bot.onText(/\/asistencia/, async (msg) => {
  const chatId = msg.chat.id;
  let nombres: string;
  const msg1 = await bot.sendMessage(
    chatId,
    "Ingrese los nombres seguido de una coma (Juanito, Pepito,...):",
    {
      reply_markup: {
        force_reply: true,
      },
    }
  );

  // Promesa que se resolverá cuando el usuario responda al primer mensaje
  const respuesta1 = new Promise<void>((resolve) => {
    bot.onReplyToMessage(chatId, msg1.message_id, async (msg1_1) => {
      nombres = msg1_1.text!;
      resolve();
    });
  });

  await respuesta1;

  //how to get a date with format dd/mm/yyyy in javascript
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const fecha = `${day}/${month}/${year}`;

  // Split the string on comma separation and put the items in an array
  const listNombres: string[] = nombres!.replace(" ", "").split(",");

  const response = await toAsistencia({
    date: fecha,
    names: listNombres,
    filePath: archivoAsistencia,
  });

  if (response) {
    await bot.sendMessage(chatId, "Si señor, pura gente responsable 👍");
  } else {
    await bot.sendMessage(chatId, "Ya nos hackearon, algo salió mal...");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
