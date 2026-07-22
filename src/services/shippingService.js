export const SANTIAGO_COMMUNES = [
  "Cerrillos",
  "Cerro Navia",
  "Conchalí",
  "El Bosque",
  "Estación Central",
  "Huechuraba",
  "Independencia",
  "La Cisterna",
  "La Florida",
  "La Granja",
  "La Pintana",
  "La Reina",
  "Las Condes",
  "Lo Barnechea",
  "Lo Espejo",
  "Lo Prado",
  "Macul",
  "Maipú",
  "Ñuñoa",
  "Pedro Aguirre Cerda",
  "Peñalolén",
  "Providencia",
  "Pudahuel",
  "Quilicura",
  "Quinta Normal",
  "Recoleta",
  "Renca",
  "San Joaquín",
  "San Miguel",
  "San Ramón",
  "Santiago",
  "Vitacura",
];

export const getSantiagoShippingCostByCommune = (commune) => {
  if (!commune) return 0;

  const zoneOne = [
    "Ñuñoa",
    "Providencia",
    "Santiago",
    "Macul",
    "San Miguel",
  ];

  const zoneTwo = [
    "La Florida",
    "Peñalolén",
    "La Reina",
    "Las Condes",
    "Vitacura",
    "Estación Central",
  ];

  if (zoneOne.includes(commune)) return 3000;
  if (zoneTwo.includes(commune)) return 4000;

  return 5000;
};