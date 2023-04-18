import express from "express";
import logger from "morgan";
import createError from "http-errors";
import { getUserId } from "./controllers/extraFunctions";
import { bot } from "./constants/constants";

const app = express();

app.use(logger("dev"));
app.use(express.json());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

require("./controllers/contabilidad/contabilidad_control_bot");
require("./controllers/asistencia/asistencia_control_bot");
require("./controllers/admin/admin_control_bot");

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = getUserId(msg);

  bot.sendMessage(
    chatId,
    `Hola, soy Semardito. Aquí tienes tu ID ${userId}, enviaselo al admin 🤖`
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default app;
