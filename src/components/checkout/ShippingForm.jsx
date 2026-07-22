import { useEffect, useState } from "react";

import {
  getRegionsByCountry,
  getProvincesByRegion,
  getCommunesByProvince,
} from "../../services/geoApiService";

function ShippingForm({ shipping, onChange }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);

  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    marginTop: "12px",
    boxSizing: "border-box",
    background: "#fff",
  };

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        setError("");

        const data = await getRegionsByCountry(shipping.countryIso || "CL");
        setRegions(data);
      } catch (error) {
        console.error("Error cargando regiones:", error);
        setError("No se pudieron cargar las regiones.");
      } finally {
        setLoadingRegions(false);
      }
    };

    loadRegions();
  }, [shipping.countryIso]);

  useEffect(() => {
    const loadProvinces = async () => {
      if (!shipping.regionId) {
        setProvinces([]);
        return;
      }

      try {
        setLoadingProvinces(true);
        setError("");

        const data = await getProvincesByRegion(shipping.regionId);
        setProvinces(data);
      } catch (error) {
        console.error("Error cargando provincias:", error);
        setError("No se pudieron cargar las provincias.");
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [shipping.regionId]);

  useEffect(() => {
    const loadCommunes = async () => {
      if (!shipping.provinceId) {
        setCommunes([]);
        return;
      }

      try {
        setLoadingCommunes(true);
        setError("");

        const data = await getCommunesByProvince(shipping.provinceId);
        setCommunes(data);
      } catch (error) {
        console.error("Error cargando comunas:", error);
        setError("No se pudieron cargar las comunas.");
      } finally {
        setLoadingCommunes(false);
      }
    };

    loadCommunes();
  }, [shipping.provinceId]);

  return (
    <section
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        marginTop: "24px",
      }}
    >
      <h2>Dirección de entrega</h2>

      {error && (
        <p
          style={{
            color: "#dc2626",
            marginTop: "12px",
            fontSize: "14px",
          }}
        >
          {error}
        </p>
      )}

      <input
        style={inputStyle}
        type="text"
        name="address"
        placeholder="Dirección"
        value={shipping.address}
        onChange={onChange}
      />

      <select
        style={inputStyle}
        name="regionId"
        value={shipping.regionId}
        onChange={onChange}
        disabled={loadingRegions}
      >
        <option value="">
          {loadingRegions ? "Cargando regiones..." : "Selecciona una región"}
        </option>

        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      <select
        style={inputStyle}
        name="provinceId"
        value={shipping.provinceId}
        onChange={onChange}
        disabled={!shipping.regionId || loadingProvinces}
      >
        <option value="">
          {loadingProvinces
            ? "Cargando provincias..."
            : "Selecciona una provincia"}
        </option>

        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        style={inputStyle}
        name="communeId"
        value={shipping.communeId}
        onChange={onChange}
        disabled={!shipping.provinceId || loadingCommunes}
      >
        <option value="">
          {loadingCommunes ? "Cargando comunas..." : "Selecciona una comuna"}
        </option>

        {communes.map((commune) => (
          <option key={commune.id} value={commune.id}>
            {commune.name}
          </option>
        ))}
      </select>

      <textarea
        style={{
          ...inputStyle,
          minHeight: "90px",
          resize: "vertical",
        }}
        name="notes"
        placeholder="Notas adicionales"
        value={shipping.notes}
        onChange={onChange}
      />
    </section>
  );
}

export default ShippingForm;