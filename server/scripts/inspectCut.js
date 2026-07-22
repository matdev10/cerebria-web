import XLSX from "xlsx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(
  __dirname,
  "../data/geo/raw/CUT_2018_v04.xls"
);

const workbook = XLSX.readFile(filePath);

console.log("Hojas encontradas:");
console.log(workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  console.log("\n==============================");
  console.log(`Hoja: ${sheetName}`);
  console.log("==============================");

  console.log("Primeras 10 filas:");
  console.log(rows.slice(0, 10));
}