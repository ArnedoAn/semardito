import Excel from "exceljs";

export default async function insertContability(
  { cantidad, descripcion, nombreUsuario }: any,
  sheetPath: any
) {
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
