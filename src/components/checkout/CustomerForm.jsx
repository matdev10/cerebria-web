function CustomerForm({ customer, onChange }) {
  return (
    <section style={cardStyle}>
      <h2>Datos del cliente</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={customer.name}
        onChange={onChange}
        style={inputStyle}
      />

      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={customer.email}
        onChange={onChange}
        style={inputStyle}
      />

      <input
        type="text"
        name="phone"
        placeholder="Teléfono"
        value={customer.phone}
        onChange={onChange}
        style={inputStyle}
      />
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
};

export default CustomerForm;