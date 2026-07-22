import { CHILE_GEOGRAPHY } from "../data/chileGeography";

export const getRegions = () => {
  return CHILE_GEOGRAPHY;
};

export const getRegionById = (regionId) => {
  return CHILE_GEOGRAPHY.find((region) => region.id === regionId);
};

export const getCitiesByRegion = (regionId) => {
  const region = getRegionById(regionId);
  return region ? region.cities : [];
};

export const getCommunesByRegionAndCity = (regionId, cityId) => {
  const region = getRegionById(regionId);
  const city = region?.cities.find((city) => city.id === cityId);

  return city ? city.communes : [];
};