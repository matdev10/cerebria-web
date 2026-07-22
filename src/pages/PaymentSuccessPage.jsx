import { Link, useSearchParams } from "react-router-dom";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
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
        <div style={{ fontSize: "56px" }}>✅</div>

        <h1>Pago recibido</h1>

        <p>
          Mercado Pago informó que el pago fue procesado. Estamos verificando
          la confirmación definitiva del pedido.
        </p>

        {externalReference && (
          <p>
            Pedido: <strong>{externalReference}</strong>
          </p>
        )}

        {paymentId && (
          <p>
            Pago Mercado Pago: <strong>{paymentId}</strong>
          </p>
        )}

        {status && (
          <p>
            Estado informado: <strong>{status}</strong>
          </p>
        )}

        <Link to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}

export default PaymentSuccessPage;