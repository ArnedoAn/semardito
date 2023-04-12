import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import TelegramBot from "node-telegram-bot-api";
import * as xlsx from "xlsx";
import fs from "fs";
import Excel from "exceljs";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const bot = new TelegramBot("6052206060:AAH2E79emRRoZFEVlT3QNx3KWKA4Kzncq6o", {
  polling: true,
});

// Ubicación del archivo de hoja de cálculo
const archivoHojaDeCalculo = path.join(
  __dirname,
  "documents",
  "contabilidad.xlsx"
);

// Verificar si el archivo existe
if (!fs.existsSync(archivoHojaDeCalculo)) {
  // Si no existe, crearlo
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet("Sheet1");
  // Configurar las columnas y encabezados de la hoja de cálculo
  sheet.columns = [
    { header: "Cantidad", key: "cantidad" },
    { header: "Descripción", key: "descripcion" },
    { header: "Fecha", key: "fecha" },
  ];
  workbook.xlsx
    .writeFile(archivoHojaDeCalculo)
    .then(() => {
      console.log("Archivo de hoja de cálculo creado exitosamente");
      // Continuar con la lógica de manejo de mensajes de Telegram
    })
    .catch((err: any) => {
      console.error("Error al crear archivo de hoja de cálculo:", err);
    });
} else {
  // Continuar con la lógica de manejo de mensajes de Telegram

  // Manejador para el comando /in
  bot.onText(/\/in/, async (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    //const userId = msg.from.id;

    // Enviar mensaje solicitando la cantidad
    bot.sendMessage(chatId, "Por favor, ingrese la cantidad monetaria:");

    // Escuchar el siguiente mensaje del usuario
    bot.once("message", (msg) => {
      const cantidad = msg.text;
      console.log(cantidad);

      // Enviar mensaje solicitando la descripción
      bot.sendMessage(chatId, "Por favor, ingrese la descripción:");

      // Escuchar el siguiente mensaje del usuario
      bot.once("message", (msg) => {
        const descripcion = msg.text;
        console.log(descripcion);

        // Obtener la fecha actual
        const fecha = new Date().toLocaleDateString();

        // Crear objeto con los datos del registro
        const registro = {
          cantidad,
          descripcion,
          fecha,
        };

        // Leer la hoja de cálculo existente o crear una nueva si no existe
        let workbook;
        if (fs.existsSync(archivoHojaDeCalculo)) {
          workbook = xlsx.readFile(archivoHojaDeCalculo);
        } else {
          workbook = xlsx.utils.book_new();
        }

        const sheetName = "Sheet1";
        const sheet = workbook.Sheets[sheetName] || "";

        // Obtener el rango de celdas ocupadas en la hoja de cálculo
        const range = xlsx.utils.decode_range(sheet["!ref"]!);
        const newRow = range.e.r + 1;

        // Escribir los datos del registro en la hoja de cálculo
        sheet[`A${newRow}`] = { t: "n", v: parseFloat(registro.cantidad!) };
        sheet[`B${newRow}`] = { t: "s", v: registro.descripcion };
        sheet[`C${newRow}`] = { t: "s", v: registro.fecha };

        // Guardar la hoja de cálculo actualizada
        xlsx.writeFile(workbook, archivoHojaDeCalculo);

        // Registrar el mensaje en la consola del servidor
        console.log(
          `Usuario registró: Cantidad: ${registro.cantidad}, Descripción: ${registro.descripcion}, Fecha: ${registro.fecha}`
        );

        // Enviar un mensaje de confirmación al usuario
        bot.sendMessage(chatId, "Registro agregado exitosamente.");
      });
    });
  });
}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
