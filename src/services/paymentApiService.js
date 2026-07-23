const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function createPaymentPreference(orderData) {
  const response = await fetch(`${API_URL}/payments/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "El servidor respondió con un formato no válido."
    );
  }

  if (!response.ok) {
    const validationErrors = Array.isArray(result.errors)
      ? result.errors.join(" ")
      : "";

    throw new Error(
      validationErrors ||
        result.message ||
        "No fue posible iniciar el pago con Mercado Pago."
    );
  }

  if (!result.data?.initPoint && !result.data?.sandboxInitPoint) {
    throw new Error(
      "Mercado Pago no devolvió una dirección de pago."
    );
  }

  return result.data;
}

export async function reconcilePayment({
  paymentId,
  orderNumber,
}) {
  const response = await fetch(
    `${API_URL}/payments/reconcile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        orderNumber,
      }),
    }
  );

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "El servidor respondió con un formato no válido."
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "No fue posible confirmar el pago."
    );
  }

  return result.data;
}