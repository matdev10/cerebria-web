import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { reconcilePayment } from "../services/paymentApiService";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart, closeCart } = useCart();

  const hasReconciled = useRef(false);

  const [verificationStatus, setVerificationStatus] =
    useState("verifying");

  const [verificationMessage, setVerificationMessage] =
    useState("Estamos confirmando tu pago con Mercado Pago.");

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const externalReference =
    searchParams.get("external_reference");

  useEffect(() => {
    if (hasReconciled.current) {
      return;
    }

    hasReconciled.current = true;

    const verifyPayment = async () => {
      if (!paymentId || !externalReference) {
        setVerificationStatus("error");
        setVerificationMessage(
          "No fue posible identificar correctamente el pago o el pedido."
        );
        return;
      }

      try {
        const result = await reconcilePayment({
          paymentId,
          orderNumber: externalReference,
        });

        if (result?.status !== "PAID") {
          setVerificationStatus("pending");
          setVerificationMessage(
            "El pago todavía está siendo procesado. El pedido permanecerá pendiente hasta recibir la confirmación."
          );
          return;
        }

        clearCart();
        closeCart();

        setVerificationStatus("success");
        setVerificationMessage(
          "Tu pago fue confirmado correctamente y el pedido quedó registrado."
        );
      } catch (error) {
        console.error(
          "Error verificando el pago:",
          error
        );

        setVerificationStatus("error");
        setVerificationMessage(
          error.message ||
            "No fue posible confirmar el pago. Conserva el número de operación para revisar el pedido."
        );
      }
    };

    verifyPayment();
  }, [
    paymentId,
    externalReference,
    clearCart,
    closeCart,
  ]);

  const statusIcon = {
    verifying: "⏳",
    success: "✅",
    pending: "🕒",
    error: "⚠️",
  };

  const statusTitle = {
    verifying: "Verificando pago",
    success: "Pago confirmado",
    pending: "Pago en revisión",
    error: "No pudimos confirmar el pago",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f8fafc",
        padding: "120px 24px 40px",
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
        <div style={{ fontSize: "56px" }}>
          {statusIcon[verificationStatus]}
        </div>

        <h1>{statusTitle[verificationStatus]}</h1>

        <p>{verificationMessage}</p>

        {externalReference && (
          <p>
            Pedido:{" "}
            <strong>{externalReference}</strong>
          </p>
        )}

        {paymentId && (
          <p>
            Pago Mercado Pago:{" "}
            <strong>{paymentId}</strong>
          </p>
        )}

        {status && (
          <p>
            Estado informado:{" "}
            <strong>{status}</strong>
          </p>
        )}

        <Link to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}

export default PaymentSuccessPage;