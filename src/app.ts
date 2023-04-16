import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import TelegramBot from "node-telegram-bot-api";
import toContabilidad from "./routes/contabilidad";
import toAsistencia from "./routes/asistencia";
import fs from "fs";
import { verifyUser, addUser } from "./routes/adminSettings";
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

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, {
  polling: true,
});

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

const getUserId = (msg: TelegramBot.Message) => {
  return msg.from?.id;
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = getUserId(msg);

  bot.sendMessage(
    chatId,
    `Hola, soy Semardito. Aquí tienes tu ID ${userId}, enviaselo al admin 🤖`
  );
});

bot.onText(/\/newUser/, async (msg) => {
  const chatId = msg.chat.id;
  let user = {
    telegramId: 0,
    firstName: "",
    lastName: "",
  };
  const userId = getUserId(msg);
  if (userId?.toString() != process.env.ADMIN_ID) {
    bot.sendMessage(chatId, "Literalmente no tienes level para esto 🐥");
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

bot.onText(/\/money/, async (msg) => {
  const chatId = msg.chat.id;
  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "No te da para tanto 👍");
    return;
  }
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
  if (!(await verifyUser(getUserId(msg)!))) {
    bot.sendMessage(chatId, "No te da para tanto 👍");
    return;
  }
  let nombres: string;
  const msg1 = await bot.sendMessage(
    chatId,
    "Ingrese los apellidos seguido de una coma (A, B,...):",
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
  const mes = getMonthName(month);

  const response = await toAsistencia(
    fecha,
    listNombres,
    mes,
    archivoAsistencia
  );

  if (response) {
    await bot.sendMessage(chatId, "Si señor, pura gente responsable 👍");
  } else {
    await bot.sendMessage(chatId, "Ya nos hackearon, algo salió mal...");
  }
});

//convert moth number to string(spanish with first letter in uppercase)
function getMonthName(month: number) {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthNames[month - 1];
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
