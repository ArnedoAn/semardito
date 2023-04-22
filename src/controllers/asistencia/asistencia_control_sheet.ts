import { showInfo } from "../controll_sheet";
import { Asistencia } from "../../interfaces/interfaces_asistencia";

// Metodo para listar la sheet
export const AccederSheet = async (): Promise<any> => {
  try {
    const sheet = await showInfo(1);
    if (typeof sheet === "object") {
      const registros = await sheet.getRows();
      console.log(registros);
      // Retorno registros
      return registros;
    } else {
      console.error("TODO MAL");
    }
  } catch (e) {
    console.error("Se presentó el siguiente error: ", e);
    return e;
  }
};

// Metodo para actualizar sheet
export const EscribirSheet = async (data: Asistencia): Promise<boolean> => {
  try {
    const sheet = await showInfo(1);
    if (typeof sheet === "object") {
      // Añadir registro a la sheet
      await sheet.addRow(data);
      console.log("Asistencia exitosa");

      return true;
    } else {
      console.error("TODO MAL");
      return false;
    }
  } catch (e) {
    console.error("Se presentó el siguiente error: ", e);
    return false;
  }
};
