import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(
  __dirname,
  "../data/geo/raw/CUT_2018_v04.xls"
);

const normalizeText = (value) => {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
};

const readCutFile = () => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  return rows.slice(1).map((row) => ({
    regionCode: normalizeText(row[0]),
    regionName: normalizeText(row[1]),
    regionAbbreviation: normalizeText(row[2]),
    provinceCode: normalizeText(row[3]),
    provinceName: normalizeText(row[4]),
    communeCode: normalizeText(row[5]),
    communeName: normalizeText(row[6]),
  }));
};

const CEREBRIA_PRODUCT = {
  name: "Cerebria",
  description:
    "Suplemento alimenticio para el bienestar cognitivo.",
  price: 20000,
  stock: 13,
  imageUrl: "/producto.png",
  isActive: true,
};

const seedCerebriaProduct = async () => {
  const existingProducts = await prisma.product.findMany({
    where: {
      name: CEREBRIA_PRODUCT.name,
    },
    select: {
      id: true,
      stock: true,
    },
  });

  if (existingProducts.length > 1) {
    throw new Error(
      "Existen varios productos llamados Cerebria. El seed fue detenido para evitar modificar el producto incorrecto."
    );
  }

  if (existingProducts.length === 1) {
    const existingProduct = existingProducts[0];

    const updatedProduct = await prisma.product.update({
      where: {
        id: existingProduct.id,
      },
      data: {
        description: CEREBRIA_PRODUCT.description,
        price: CEREBRIA_PRODUCT.price,
        imageUrl: CEREBRIA_PRODUCT.imageUrl,
        isActive: true,
      },
    });

    console.log(
      `✅ Producto Cerebria actualizado. Stock conservado: ${updatedProduct.stock}`
    );

    return updatedProduct;
  }

  const createdProduct = await prisma.product.create({
    data: CEREBRIA_PRODUCT,
  });

  console.log(
    `✅ Producto Cerebria creado con stock ${createdProduct.stock}`
  );

  return createdProduct;
};

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  await seedCerebriaProduct();

  console.log("🌎 Iniciando seed del Geo Module desde CUT...");

  const rows = readCutFile();

  const chile = await prisma.geoCountry.upsert({
    where: {
      isoCode: "CL",
    },
    update: {
      name: "Chile",
      isActive: true,
    },
    create: {
      isoCode: "CL",
      name: "Chile",
      isActive: true,
    },
  });

  const regionMap = new Map();
  const provinceMap = new Map();

  for (const row of rows) {
    if (
      !row.regionCode ||
      !row.regionName ||
      !row.provinceCode ||
      !row.provinceName ||
      !row.communeCode ||
      !row.communeName
    ) {
      console.warn("Fila omitida por datos incompletos:", row);
      continue;
    }

    let region = regionMap.get(row.regionCode);

    if (!region) {
      region = await prisma.geoRegion.upsert({
        where: {
          countryId_code: {
            countryId: chile.id,
            code: row.regionCode,
          },
        },
        update: {
          name: row.regionName,
          isActive: true,
        },
        create: {
          code: row.regionCode,
          name: row.regionName,
          countryId: chile.id,
          isActive: true,
        },
      });

      regionMap.set(row.regionCode, region);
    }

    let province = provinceMap.get(row.provinceCode);

    if (!province) {
      province = await prisma.geoProvince.upsert({
        where: {
          regionId_code: {
            regionId: region.id,
            code: row.provinceCode,
          },
        },
        update: {
          name: row.provinceName,
          isActive: true,
        },
        create: {
          code: row.provinceCode,
          name: row.provinceName,
          regionId: region.id,
          isActive: true,
        },
      });

      provinceMap.set(row.provinceCode, province);
    }

    await prisma.geoCommune.upsert({
      where: {
        provinceId_code: {
          provinceId: province.id,
          code: row.communeCode,
        },
      },
      update: {
        name: row.communeName,
        regionId: region.id,
        isActive: true,
      },
      create: {
        code: row.communeCode,
        name: row.communeName,
        regionId: region.id,
        provinceId: province.id,
        isActive: true,
      },
    });
  }

  const countryCount = await prisma.geoCountry.count();
  const regionCount = await prisma.geoRegion.count();
  const provinceCount = await prisma.geoProvince.count();
  const communeCount = await prisma.geoCommune.count();

  console.log("✅ Seed Geo Module completado");
  console.log({
    countries: countryCount,
    regions: regionCount,
    provinces: provinceCount,
    communes: communeCount,
  });
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed de datos");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });