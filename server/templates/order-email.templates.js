const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

const formatCurrency = (value) =>
  currencyFormatter.format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) {
    return "Sin fecha registrada";
  }

  return dateFormatter.format(new Date(value));
};

const getCustomerName = (customer) =>
  [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "Cliente";

const getShippingMethodLabel = (shippingMethod) => {
  if (shippingMethod === "CHILEXPRESS_PAY_ON_DELIVERY") {
    return "Chilexpress por pagar";
  }

  return "Despacho a domicilio en Santiago";
};

const getShippingAddress = (order) =>
  [
    order.shippingAddress,
    order.shippingCommune,
    order.shippingProvince,
    order.shippingRegion,
  ]
    .filter(Boolean)
    .join(", ");

const buildItemsHtml = (items = []) =>
  items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:14px 0;
              border-bottom:1px solid #e3ece9;
              color:#14383b;
            "
          >
            <strong>${escapeHtml(item.productName)}</strong>

            <div
              style="
                margin-top:4px;
                color:#718487;
                font-size:13px;
              "
            >
              ${item.quantity} × ${formatCurrency(item.unitPrice)}
            </div>
          </td>

          <td
            align="right"
            style="
              padding:14px 0;
              border-bottom:1px solid #e3ece9;
              color:#14383b;
              font-weight:700;
              white-space:nowrap;
            "
          >
            ${formatCurrency(item.subtotal)}
          </td>
        </tr>
      `
    )
    .join("");

const buildItemsText = (items = []) =>
  items
    .map(
      (item) =>
        `- ${item.productName}: ` +
        `${item.quantity} × ${formatCurrency(item.unitPrice)} = ` +
        `${formatCurrency(item.subtotal)}`
    )
    .join("\n");

const buildEmailLayout = ({
  eyebrow,
  title,
  content,
}) => `
  <!doctype html>
  <html lang="es">
    <body
      style="
        margin:0;
        padding:32px 16px;
        background:#f2f7f5;
        font-family:Arial,Helvetica,sans-serif;
        color:#14383b;
      "
    >
      <div
        style="
          max-width:640px;
          margin:0 auto;
          overflow:hidden;
          border:1px solid #d7e5e1;
          border-radius:22px;
          background:#ffffff;
        "
      >
        <header
          style="
            padding:30px;
            background:#062c30;
            color:#ffffff;
          "
        >
          <p
            style="
              margin:0 0 8px;
              color:#9ed9d3;
              font-size:12px;
              font-weight:800;
              letter-spacing:2px;
              text-transform:uppercase;
            "
          >
            ${escapeHtml(eyebrow)}
          </p>

          <h1
            style="
              margin:0;
              font-size:28px;
              line-height:1.25;
            "
          >
            ${escapeHtml(title)}
          </h1>
        </header>

        <main style="padding:30px;">
          ${content}
        </main>

        <footer
          style="
            padding:20px 30px;
            border-top:1px solid #e3ece9;
            background:#f7faf9;
            color:#718487;
            font-size:12px;
            line-height:1.6;
          "
        >
          Cerebria® · Aligal<br />
          Santiago, Chile
        </footer>
      </div>
    </body>
  </html>
`;

export const buildCustomerOrderEmail = (order) => {
  const customerName = getCustomerName(order.customer);
  const shippingMethod = getShippingMethodLabel(
    order.shippingMethod
  );
  const shippingAddress = getShippingAddress(order);

  const subject =
    `Pago confirmado — Pedido ${order.orderNumber}`;

  const html = buildEmailLayout({
    eyebrow: "Pedido confirmado",
    title: "Tu pago fue confirmado",
    content: `
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
        Hola <strong>${escapeHtml(customerName)}</strong>,
        recibimos correctamente el pago de tu pedido Cerebria®.
      </p>

      <div
        style="
          margin-bottom:24px;
          padding:18px;
          border-radius:14px;
          background:#f1f7f5;
        "
      >
        <strong>Pedido</strong>

        <p style="margin:6px 0 0;">
          ${escapeHtml(order.orderNumber)}
        </p>

        <p
          style="
            margin:6px 0 0;
            color:#718487;
            font-size:13px;
          "
        >
          Pago confirmado el
          ${escapeHtml(formatDate(order.paidAt))}
        </p>
      </div>

      <h2 style="margin:0 0 8px;font-size:19px;">
        Detalle de la compra
      </h2>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="width:100%;border-collapse:collapse;"
      >
        ${buildItemsHtml(order.items)}

        <tr>
          <td style="padding:16px 0 6px;color:#718487;">
            Subtotal
          </td>

          <td align="right" style="padding:16px 0 6px;font-weight:700;">
            ${formatCurrency(order.subtotal)}
          </td>
        </tr>

        <tr>
          <td style="padding:6px 0;color:#718487;">
            Despacho
          </td>

          <td align="right" style="padding:6px 0;font-weight:700;">
            ${formatCurrency(order.shippingCost)}
          </td>
        </tr>

        <tr>
          <td
            style="
              padding:14px 0 0;
              border-top:1px solid #d7e5e1;
              font-size:18px;
              font-weight:800;
            "
          >
            Total
          </td>

          <td
            align="right"
            style="
              padding:14px 0 0;
              border-top:1px solid #d7e5e1;
              font-size:22px;
              font-weight:900;
            "
          >
            ${formatCurrency(order.total)}
          </td>
        </tr>
      </table>

      <div
        style="
          margin-top:26px;
          padding:18px;
          border:1px solid #d7e5e1;
          border-radius:14px;
        "
      >
        <strong>Entrega</strong>

        <p style="margin:8px 0 0;line-height:1.6;">
          ${escapeHtml(shippingMethod)}<br />
          ${escapeHtml(shippingAddress)}
        </p>

        ${
          order.shippingNotes
            ? `
              <p
                style="
                  margin:10px 0 0;
                  color:#718487;
                  font-size:13px;
                  line-height:1.6;
                "
              >
                Nota: ${escapeHtml(order.shippingNotes)}
              </p>
            `
            : ""
        }
      </div>
    `,
  });

  const text = [
    `Hola ${customerName},`,
    "",
    "Tu pago fue confirmado correctamente.",
    `Pedido: ${order.orderNumber}`,
    `Fecha: ${formatDate(order.paidAt)}`,
    "",
    "Productos:",
    buildItemsText(order.items),
    "",
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Despacho: ${formatCurrency(order.shippingCost)}`,
    `Total: ${formatCurrency(order.total)}`,
    "",
    `Método de entrega: ${shippingMethod}`,
    `Dirección: ${shippingAddress}`,
    order.shippingNotes
      ? `Notas: ${order.shippingNotes}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
};

export const buildAdminOrderEmail = (order) => {
  const customerName = getCustomerName(order.customer);
  const shippingMethod = getShippingMethodLabel(
    order.shippingMethod
  );
  const shippingAddress = getShippingAddress(order);

  const subject =
    `Nueva venta Cerebria® — ${order.orderNumber}`;

  const html = buildEmailLayout({
    eyebrow: "Nueva venta",
    title: "Se confirmó un nuevo pedido",
    content: `
      <div
        style="
          margin-bottom:24px;
          padding:18px;
          border-radius:14px;
          background:#f1f7f5;
        "
      >
        <strong>${escapeHtml(order.orderNumber)}</strong>

        <p style="margin:6px 0 0;color:#607579;">
          Total pagado:
          <strong>${formatCurrency(order.total)}</strong>
        </p>
      </div>

      <h2 style="font-size:19px;">Datos del cliente</h2>

      <p style="line-height:1.7;">
        <strong>Nombre:</strong>
        ${escapeHtml(customerName)}<br />

        <strong>Correo:</strong>
        ${escapeHtml(order.customer.email)}<br />

        <strong>Teléfono:</strong>
        ${escapeHtml(order.customer.phone)}
      </p>

      <h2 style="margin-top:24px;font-size:19px;">
        Productos
      </h2>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="width:100%;border-collapse:collapse;"
      >
        ${buildItemsHtml(order.items)}
      </table>

      <h2 style="margin-top:24px;font-size:19px;">
        Despacho
      </h2>

      <p style="line-height:1.7;">
        <strong>Método:</strong>
        ${escapeHtml(shippingMethod)}<br />

        <strong>Dirección:</strong>
        ${escapeHtml(shippingAddress)}<br />

        <strong>Costo:</strong>
        ${formatCurrency(order.shippingCost)}
      </p>

      ${
        order.shippingNotes
          ? `
            <p
              style="
                padding:14px;
                border-radius:12px;
                background:#fff8df;
                line-height:1.6;
              "
            >
              <strong>Notas de entrega:</strong><br />
              ${escapeHtml(order.shippingNotes)}
            </p>
          `
          : ""
      }

      <h2 style="margin-top:24px;font-size:19px;">
        Pago
      </h2>

      <p style="line-height:1.7;">
        <strong>Payment ID:</strong>
        ${escapeHtml(order.paymentId || "No disponible")}<br />

        <strong>Estado:</strong>
        ${escapeHtml(order.paymentStatus || "approved")}<br />

        <strong>Fecha:</strong>
        ${escapeHtml(formatDate(order.paidAt))}
      </p>
    `,
  });

  const text = [
    "Nueva venta Cerebria®",
    "",
    `Pedido: ${order.orderNumber}`,
    `Total pagado: ${formatCurrency(order.total)}`,
    "",
    `Cliente: ${customerName}`,
    `Correo: ${order.customer.email}`,
    `Teléfono: ${order.customer.phone}`,
    "",
    "Productos:",
    buildItemsText(order.items),
    "",
    `Método de entrega: ${shippingMethod}`,
    `Dirección: ${shippingAddress}`,
    `Costo de despacho: ${formatCurrency(order.shippingCost)}`,
    order.shippingNotes
      ? `Notas: ${order.shippingNotes}`
      : "",
    "",
    `Payment ID: ${order.paymentId || "No disponible"}`,
    `Estado: ${order.paymentStatus || "approved"}`,
    `Fecha: ${formatDate(order.paidAt)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
};