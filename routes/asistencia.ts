import * as xlsx from "xlsx";
import * as fs from "fs";

export interface InputAsistencia {
  date: string; // formato: "DD/MM/YYYY"
  names: string[];
  filePath: string;
}

/**
 * Función que escribe los nombres de los asistentes en la hoja de cálculo de asistencia (La hoja de cálculo debe existir).
 * @param inputData
 * @returns
 *
 * @example
 *
 * const inputData: InputAsistencia = {
 *  date: "01/01/2021",
 * names: ["Juan", "Pedro", "María"],
 * filePath: "C:\\Users\\user\\Documents\\asistencia.xlsx"
 * }
 *
 * writeToExcel(inputData)
 */
export default async function writeToExcel(
  inputData: InputAsistencia
): Promise<boolean> {
  try {
    const workbook = xlsx.read(await fs.promises.readFile(inputData.filePath), {
      type: "buffer",
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Busca la columna de la fecha
    const dateCell = Object.keys(sheet).filter(
      (cell) => cell.startsWith("A") && sheet[cell].w === inputData.date
    )[0];

    // Escribe cada nombre en la celda correspondiente a la fecha
    inputData.names.forEach((name, index) => {
      const cell = String.fromCharCode(66 + index) + dateCell.slice(1);
      sheet[cell] = { t: "s", v: name };
    });

    // Guarda el archivo sobrescribiendo el archivo existente
    await fs.promises.writeFile(
      inputData.filePath,
      xlsx.write(workbook, { type: "buffer", bookType: "xlsx" })
    );
    console.log("Archivo actualizado exitosamente");
    return true;
  } catch (error) {
    console.error("Error al actualizar el archivo", error);
    return false;
  }
}

// const veryfySheet = async (archivoHojaDeCalculo: any) => {
//   if (!fs.existsSync(archivoHojaDeCalculo)) {
//     // Si no existe, crearlo
//     const workbook = new Excel.Workbook();
//     const sheet = workbook.addWorksheet("Sheet1");
//     // Configurar las columnas y encabezados de la hoja de cálculo
//     sheet.columns = [
//       { header: "Cantidad", key: "cantidad" },
//       { header: "Descripción", key: "descripcion" },
//       { header: "Fecha", key: "fecha" },
//     ];
//     workbook.xlsx
//       .writeFile(archivoHojaDeCalculo)
//       .then(() => {
//         console.log("Archivo de hoja de cálculo creado exitosamente");
//         // Continuar con la lógica de manejo de mensajes de Telegram
//       })
//       .catch((err: any) => {
//         console.error("Error al crear archivo de hoja de cálculo:", err);
//       });
//   } else {
//     console.log("Archivo de hoja de cálculo encontrado");
//   }
// };
