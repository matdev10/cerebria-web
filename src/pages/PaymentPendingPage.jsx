import { Link, useSearchParams } from "react-router-dom";

function PaymentPendingPage() {
  const [searchParams] = useSearchParams();

  const externalReference = searchParams.get("external_reference");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "#fff",
          border: "1px solid #dbe4ee",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px" }}>⏳</div>

        <h1>Pago pendiente</h1>

        <p>
          El pago todavía está siendo procesado. El pedido se confirmará cuando
          Mercado Pago informe el resultado definitivo.
        </p>

        {externalReference && (
          <p>
            Pedido: <strong>{externalReference}</strong>
          </p>
        )}

        <Link to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}

export default PaymentPendingPage;