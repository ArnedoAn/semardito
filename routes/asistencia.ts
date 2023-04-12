import * as Excel from "exceljs";

export default async function registrarAsistencia(
  cantidadAsistentes: number,
  nombresAsistentes: string[],
  sheetPath: string
) {
  // Obtener la fecha actual en el formato dd-mm-aaaa
  const fechaActual = new Date().toLocaleDateString();

  // Ruta del archivo Excel existente
  const archivoExcel = sheetPath;

  // Cargar el archivo Excel existente
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(archivoExcel);

  // Obtener la hoja de trabajo
  const worksheet = workbook.getWorksheet(1);

  // Obtener la última columna en la hoja de trabajo
  const lastCol = worksheet.lastColumn;

  // Obtener el número de fila para el próximo registro
  const nextRow = worksheet.rowCount + 1;

  // Escribir la fecha actual en la nueva columna
  worksheet.getCell(
    `${Excel.utils.columnToLetter(lastCol.number + 1)}1`
  ).value = fechaActual;

  // Escribir la cantidad de asistentes en la nueva columna
  worksheet.getCell(
    `${Excel.utils.columnToLetter(lastCol.number + 1)}${nextRow}`
  ).value = cantidadAsistentes;

  // Escribir los nombres de los asistentes en la misma columna
  nombresAsistentes.forEach((nombre, index) => {
    worksheet.getCell(
      `${Excel.utils.columnToLetter(lastCol.number + 1)}${nextRow + index + 1}`
    ).value = nombre;
  });

  // Guardar los cambios en el archivo Excel
  await workbook.xlsx.writeFile(archivoExcel);

  console.log(
    `La asistencia para el día ${fechaActual} se ha registrado exitosamente en el archivo Excel, junto con los nombres de los asistentes.`
  );
}
