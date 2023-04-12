import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import TelegramBot from "node-telegram-bot-api";

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


const bot = new TelegramBot("6052206060:AAH2E79emRRoZFEVlT3QNx3KWKA4Kzncq6o", {
  polling: true,
});

// Ubicación del archivo de hoja de cálculo
const archivoContabilidad = path.join(
  __dirname,
  "documents",
  "contabilidad.xlsx"
);

const archivoAsistencia = path.join(__dirname, "documents", "asistencia.xlsx");

// Verificar si el archivo existe
const veryfySheet = async (archivoHojaDeCalculo: any) => {
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
    console.log("Archivo de hoja de cálculo encontrado");
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  bot.sendMessage(
    chatId,
    "Bienvenido al bot de contabilidad. Por favor, ingrese el comando /in para registrar una entrada o el comando /out para registrar una salida."
  );
});

bot.onText(/\/out/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  bot.sendMessage(chatId, "Por favor, ingrese la cantidad monetaria:");
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
