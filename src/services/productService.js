const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return response.json();
}