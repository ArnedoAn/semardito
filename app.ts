import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import TelegramBot from "node-telegram-bot-api";
import toContabilidad from "./routes/contabilidad";
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
  const messageId = msg.message_id;

  bot.sendMessage(
    chatId,
    "Bienvenido al bot de contabilidad. Por favor, ingrese el comando /in para registrar una entrada o el comando /out para registrar una salida."
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


app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
