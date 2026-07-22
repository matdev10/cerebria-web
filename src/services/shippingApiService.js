const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const handleResponse = async (response) => {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Error calculando envío");
  }

  return result.data;
};

export const getShippingQuote = async ({ communeId }) => {
  const response = await fetch(`${API_URL}/shipping/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      communeId,
    }),
  });

  return handleResponse(response);
};