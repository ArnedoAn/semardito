import Excel from "exceljs";
import * as fs from "fs";

export default async function insertContability(
  { cantidad, descripcion, nombreUsuario }: any,
  sheetPath: any
) {
  await veryfySheet(sheetPath);
  const fecha = new Date().toLocaleDateString();
  const workbook = new Excel.Workbook();
  try {
    await workbook.xlsx.readFile(sheetPath);

    // Obtener la hoja de trabajo
    const worksheet = workbook.getWorksheet(1);

    // Obtener la última fila en la hoja de trabajo
    const lastRow = worksheet.lastRow;

    // Obtener el número de columna para el próximo registro
    const nextCol = worksheet.columnCount + 1;

    // Escribir los datos en las celdas correspondientes
    worksheet.getCell(`A${lastRow!.number + 1}`).value = cantidad;
    worksheet.getCell(`B${lastRow!.number + 1}`).value = descripcion;
    worksheet.getCell(`C${lastRow!.number + 1}`).value = fecha;
    worksheet.getCell(`D${lastRow!.number + 1}`).value = nombreUsuario;

    // Guardar los cambios en el archivo Excel
    await workbook.xlsx.writeFile(sheetPath);
    // Registrar el mensaje en la consola del servidor
    console.log(
      `Usuario registró: Cantidad: ${cantidad}, Descripción: ${descripcion}, Fecha: ${fecha}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

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
