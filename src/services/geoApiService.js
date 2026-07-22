const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const handleResponse = async (response) => {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Error consultando datos geográficos");
  }

  return result.data;
};

export const getCountries = async () => {
  const response = await fetch(`${API_URL}/geo/countries`);
  return handleResponse(response);
};

export const getRegionsByCountry = async (isoCode = "CL") => {
  const response = await fetch(`${API_URL}/geo/countries/${isoCode}/regions`);
  return handleResponse(response);
};

export const getProvincesByRegion = async (regionId) => {
  if (!regionId) return [];

  const response = await fetch(`${API_URL}/geo/regions/${regionId}/provinces`);
  return handleResponse(response);
};

export const getCommunesByProvince = async (provinceId) => {
  if (!provinceId) return [];

  const response = await fetch(
    `${API_URL}/geo/provinces/${provinceId}/communes`
  );

  return handleResponse(response);
};