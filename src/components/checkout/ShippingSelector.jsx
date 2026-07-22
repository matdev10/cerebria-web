import { SHIPPING_METHODS } from "../../services/checkoutService";

function ShippingSelector({ shippingMethod, onChange }) {
  const methods = Object.values(SHIPPING_METHODS);

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
      <h2>Método de entrega</h2>

      {methods.map((method) => (
        <label
          key={method.id}
          style={{
            display: "block",
            marginTop: "16px",
            cursor: "pointer",
          }}
        >
          <input
            type="radio"
            name="shippingMethod"
            value={method.id}
            checked={shippingMethod === method.id}
            onChange={(e) => onChange(e.target.value)}
          />
          {" "}
          {method.name}
        </label>
      ))}
    </section>
  );
}

export default ShippingSelector;