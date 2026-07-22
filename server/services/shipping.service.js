import prisma from "../database/prisma.js";

const normalizeKey = (value) => {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const SANTIAGO_LOCAL_RATES = {
  nunoa: 3000,
  providencia: 3000,
  santiago: 3000,
  macul: 3000,
  "san miguel": 3000,

  "la florida": 4000,
  penalolen: 4000,
  "la reina": 4000,
  "las condes": 4000,
  vitacura: 4000,
  "estacion central": 4000,
  recoleta: 4000,
  independencia: 4000,
  "san joaquin": 4000,
  "quinta normal": 4000,
};

const DEFAULT_SANTIAGO_LOCAL_RATE = 5000;
const CHILEXPRESS_REGIONS_BASE_RATE = 5990;

export const quoteShipping = async ({ communeId }) => {
  if (!communeId) {
    return {
      available: false,
      status: "PENDING_ADDRESS",
      message: "Selecciona una comuna para calcular el despacho.",
      cost: 0,
    };
  }

  const commune = await prisma.geoCommune.findUnique({
    where: {
      id: communeId,
    },
    include: {
      region: true,
      province: true,
    },
  });

  if (!commune) {
    return {
      available: false,
      status: "COMMUNE_NOT_FOUND",
      message: "La comuna seleccionada no existe.",
      cost: 0,
    };
  }

  const isMetropolitana = commune.region.code === "13";
  const isSantiagoProvince = normalizeKey(commune.province.name) === "santiago";

  if (isMetropolitana && isSantiagoProvince) {
    const communeKey = normalizeKey(commune.name);

    const cost =
      SANTIAGO_LOCAL_RATES[communeKey] ?? DEFAULT_SANTIAGO_LOCAL_RATE;

    return {
      available: true,
      status: "QUOTED",
      shippingMethod: "LOCAL_DELIVERY",
      carrier: "MW_LOCAL",
      label: "Despacho a domicilio en Santiago",
      cost,
      region: {
        id: commune.region.id,
        code: commune.region.code,
        name: commune.region.name,
      },
      province: {
        id: commune.province.id,
        code: commune.province.code,
        name: commune.province.name,
      },
      commune: {
        id: commune.id,
        code: commune.code,
        name: commune.name,
      },
    };
  }

  return {
    available: true,
    status: "QUOTED",
    shippingMethod: "CHILEXPRESS_REGIONS",
    carrier: "CHILEXPRESS",
    label: "Envío a regiones por Chilexpress",
    cost: CHILEXPRESS_REGIONS_BASE_RATE,
    region: {
      id: commune.region.id,
      code: commune.region.code,
      name: commune.region.name,
    },
    province: {
      id: commune.province.id,
      code: commune.province.code,
      name: commune.province.name,
    },
    commune: {
      id: commune.id,
      code: commune.code,
      name: commune.name,
    },
  };
};