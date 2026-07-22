import { Link, useSearchParams } from "react-router-dom";

function PaymentFailurePage() {
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
        <div style={{ fontSize: "56px" }}>❌</div>

        <h1>No se pudo completar el pago</h1>

        <p>
          No se realizó ningún cobro confirmado. Puedes volver al checkout e
          intentarlo nuevamente.
        </p>

        {externalReference && (
          <p>
            Pedido: <strong>{externalReference}</strong>
          </p>
        )}

        <Link to="/checkout">Volver al checkout</Link>
      </section>
    </main>
  );
}

export default PaymentFailurePage;