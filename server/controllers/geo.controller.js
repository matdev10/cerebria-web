import {
  getCountries,
  getRegionsByCountryIso,
  getProvincesByRegionId,
  getCommunesByProvinceId,
} from "../services/geo.service.js";

export const listCountries = async (req, res) => {
  try {
    const countries = await getCountries();

    return res.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Error listando países:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener países",
    });
  }
};

export const listRegionsByCountry = async (req, res) => {
  try {
    const { isoCode } = req.params;

    const regions = await getRegionsByCountryIso(isoCode.toUpperCase());

    return res.json({
      success: true,
      data: regions,
    });
  } catch (error) {
    console.error("Error listando regiones:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener regiones",
    });
  }
};

export const listProvincesByRegion = async (req, res) => {
  try {
    const { regionId } = req.params;

    const provinces = await getProvincesByRegionId(regionId);

    return res.json({
      success: true,
      data: provinces,
    });
  } catch (error) {
    console.error("Error listando provincias:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener provincias",
    });
  }
};

export const listCommunesByProvince = async (req, res) => {
  try {
    const { provinceId } = req.params;

    const communes = await getCommunesByProvinceId(provinceId);

    return res.json({
      success: true,
      data: communes,
    });
  } catch (error) {
    console.error("Error listando comunas:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener comunas",
    });
  }
};