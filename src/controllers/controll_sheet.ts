import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { credenciales } from "../constants/constants";

// Credenciales de acceso a la API

let googleID: string = ""

// Funcion para obtener la sheet
export const showInfo = async (type: number): Promise<GoogleSpreadsheetWorksheet | any> => {
    try {
        // Type 1: Asistencia
        if (type === 1) {
            // ID de la sheet de asistencia
            googleID = '19dlXaw_u--9j8_W9uCdbfd0qXP2toUY9Hd-q-Hbyvpw'
        } else {
            // ID de la sheet de asistencia
            googleID = '1o17iAIJElPKYArZTlEfxFWZEGwI_Lc4DnCKegF43i7c'
        }

        // Creo instancia de documento
        const documento = new GoogleSpreadsheet(googleID)

        // Espero la confirmacion de permisos
        await documento.useServiceAccountAuth(credenciales)

        // Obtener la informacion
        await documento.loadInfo()

        // Obtengo la hoja 1 (Sheet 1)
        const sheet = documento.sheetsByIndex[0]

        return sheet
    } catch (error) {
        console.error('Se ha presentado el siguiente error: ', error)
        return error
    }
}