import express from "express";
import logger from "morgan";
import createError from "http-errors";
import { getUserId } from "./controllers/extraFunctions";
import { bot, constants } from "./constants/constants";

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
require("./controllers/admin/start_control_bot");

app.listen(constants.port, () => {
  console.log(`Server started on port ${constants.port}`);
});

export default app;
