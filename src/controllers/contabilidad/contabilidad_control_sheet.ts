import { Contabilidad } from "../../interfaces/interfaces_contabilidad";
import { showInfo } from "../controll_sheet";
import { logError } from "../extraFunctions";

// Metodo para actualizar sheet
export const EscribirSheet = async (data: Contabilidad): Promise<boolean> => {
  try {
    const sheet = await showInfo(2);
    if (typeof sheet === "object") {
      // Example
      // await sheet.addRow({
      //     "Nombre": "jh",
      //     "Dia": "2",
      //     "Mes": "3",
      //     "Año": "2023"
      // })

      // Añadir registro a la sheet
      await sheet.addRow(data);
      console.log("Registro exitoso exitoso");

      return true;
    } else {
      console.error("TODO MAL");
      return false;
    }
  } catch (e: Error | any) {
    console.error("Se presentó el siguiente error: ", e);
    await logError(new Error(e.message));
    return false;
  }
};
