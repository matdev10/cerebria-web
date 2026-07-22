import process from "node:process";

import {
  MercadoPagoConfig,
  Preference,
} from "mercadopago";

const accessToken =
  process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error(
    "Falta la variable MERCADO_PAGO_ACCESS_TOKEN en server/.env"
  );
}

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken,
});

const preferenceClient = new Preference(
  mercadoPagoClient
);

const frontendUrl =
  process.env.FRONTEND_URL?.trim() ||
  "http://localhost:5173";



export const createPaymentPreference = async ({
  orderReference,
  customer,
  items,
  shippingCost,
}) => {
  if (!orderReference) {
    throw new Error(
      "Falta la referencia de la orden"
    );
  }

  if (
    !customer?.name ||
    !customer?.email ||
    !customer?.phone
  ) {
    throw new Error(
      "Los datos del cliente están incompletos"
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(
      "La preferencia debe contener al menos un producto"
    );
  }

  const preferenceItems = items.map((item) => ({
    id: String(item.productId),
    title: item.name.trim(),
    description:
      item.description?.trim() ||
      item.name.trim(),
    quantity: Number(item.quantity),
    currency_id: "CLP",
    unit_price: Number(item.price),
  }));

  const safeShippingCost =
    Number(shippingCost) || 0;

  if (safeShippingCost > 0) {
    preferenceItems.push({
      id: "shipping",
      title: "Costo de despacho",
      description: "Despacho del pedido",
      quantity: 1,
      currency_id: "CLP",
      unit_price: safeShippingCost,
    });
  }

  const preference =
    await preferenceClient.create({
      body: {
        items: preferenceItems,


        ...(frontendUrl.startsWith("https://") && {
          back_urls: {
            success: `${frontendUrl}/pago/exitoso`,
            pending: `${frontendUrl}/pago/pendiente`,
            failure: `${frontendUrl}/pago/error`,
          },
          auto_return: "approved",
        }),

        external_reference: String(orderReference),

        metadata: {
          order_reference: String(orderReference),
        },
      },
    });

  console.log("================================");
  console.log(
    "TOKEN USER:",
    accessToken.substring(0, 20) + "..."
  );
  console.log(
    "Collector:",
    preference.collector_id
  );
  console.log(
    "Preference:",
    preference.id
  );
  console.log("================================");

  return {
    preferenceId: preference.id,
    initPoint: preference.init_point,
    sandboxInitPoint:
      preference.sandbox_init_point,
  };
};