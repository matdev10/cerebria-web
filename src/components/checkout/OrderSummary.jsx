function OrderSummary({
  cartItems,
  cartTotal,
  shippingQuote,
  loadingShipping,
  shippingError,
  checkoutTotal,
}) {
  const shippingCost = shippingQuote?.available ? shippingQuote.cost : 0;
  const hasShipping = Boolean(shippingQuote?.available);

  return (
    <aside style={cardStyle}>
      <h2>Resumen del pedido</h2>

      {cartItems.map((item) => (
        <div key={item.id} style={itemStyle}>
          <strong>{item.name}</strong>
          <span>
            {item.quantity} × ${item.price.toLocaleString("es-CL")}
          </span>
        </div>
      ))}

      <hr style={dividerStyle} />

      <div style={rowStyle}>
        <span>Subtotal</span>
        <strong>${cartTotal.toLocaleString("es-CL")}</strong>
      </div>

      <div style={shippingBoxStyle}>
        <span>Despacho</span>

        {loadingShipping && (
          <strong style={{ color: "#64748b" }}>Calculando...</strong>
        )}

        {!loadingShipping && shippingError && (
          <strong style={{ color: "#dc2626" }}>{shippingError}</strong>
        )}

        {!loadingShipping && !shippingError && hasShipping && (
          <>
            <small>{shippingQuote.label}</small>
            <strong>${shippingCost.toLocaleString("es-CL")}</strong>
          </>
        )}

        {!loadingShipping && !shippingError && !hasShipping && (
          <strong style={{ color: "#64748b" }}>Pendiente</strong>
        )}
      </div>

      <hr style={dividerStyle} />

      <div style={totalStyle}>
        <span>{hasShipping ? "Total" : "Total parcial"}</span>
        <strong>${checkoutTotal.toLocaleString("es-CL")}</strong>
      </div>
    </aside>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  border: "1px solid #e2e8f0",
  height: "fit-content",
};

const itemStyle = {
  marginTop: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const dividerStyle = {
  margin: "22px 0",
  border: "none",
  borderTop: "1px solid #e2e8f0",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "18px",
};

const shippingBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "18px",
};

const totalStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "20px",
  fontWeight: "800",
};

export default OrderSummary;