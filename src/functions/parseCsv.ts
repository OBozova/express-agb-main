import Papa from "papaparse";
import { AgbCodeSchema, agbCodeSchema } from "../schemas/agbCode.schema";

export function parseCsv(csvData:string) {
    const faultyRows: AgbCodeSchema[] = []
    const upsertRows = []
    const parseResult = Papa.parse(csvData, { header: true });

    const dataRows: any = parseResult.data;

    for (const row of dataRows) {
        const parsedRow = agbCodeSchema.safeParse(row)
        if(parsedRow.success) {
            upsertRows.push(parsedRow.data)
        } else {
            console.log(parsedRow.error)
            faultyRows.push(row)
        }
    }
    return {faultyRows, upsertRows}
}