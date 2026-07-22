function PaymentMethods({ paymentMethod, onChange }) {
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
      <h2>Método de pago</h2>

      <label style={{ display: "block", marginTop: "16px" }}>
        <input
          type="radio"
          name="paymentMethod"
          value="mercado_pago"
          checked={paymentMethod === "mercado_pago"}
          onChange={(e) => onChange(e.target.value)}
        />
        {" "}Mercado Pago
      </label>
    </section>
  );
}

export default PaymentMethods;