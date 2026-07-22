import prisma from "../database/prisma.js";

export const getCountries = async () => {
  return prisma.geoCountry.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      isoCode: true,
      name: true,
    },
  });
};

export const getRegionsByCountryIso = async (isoCode) => {
  const country = await prisma.geoCountry.findUnique({
    where: {
      isoCode,
    },
  });

  if (!country) {
    return [];
  }

  return prisma.geoRegion.findMany({
    where: {
      countryId: country.id,
      isActive: true,
    },
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });
};

export const getProvincesByRegionId = async (regionId) => {
  return prisma.geoProvince.findMany({
    where: {
      regionId,
      isActive: true,
    },
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
      name: true,
      regionId: true,
    },
  });
};

export const getCommunesByProvinceId = async (provinceId) => {
  return prisma.geoCommune.findMany({
    where: {
      provinceId,
      isActive: true,
    },
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
      name: true,
      regionId: true,
      provinceId: true,
    },
  });
};