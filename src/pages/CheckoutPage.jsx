import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

import CustomerForm from "../components/checkout/CustomerForm";
import ShippingForm from "../components/checkout/ShippingForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";

import { getShippingQuote } from "../services/shippingApiService";
import { buildOrderPayload } from "../services/checkoutService";
import { createPaymentPreference } from "../services/paymentApiService";

function CheckoutPage() {
  const {
    cartItems = [],
    cartTotal = 0,
    clearCart,
  } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shipping, setShipping] = useState({
    address: "",
    countryIso: "CL",
    regionId: "",
    provinceId: "",
    communeId: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("mercado_pago");

  const [shippingQuote, setShippingQuote] = useState(null);
  const [loadingShipping, setLoadingShipping] =
    useState(false);
  const [shippingError, setShippingError] = useState("");

  const [processingOrder, setProcessingOrder] =
    useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrder, setConfirmedOrder] =
    useState(null);

  const shippingCost = shippingQuote?.available
    ? Number(shippingQuote.cost)
    : 0;

  const checkoutTotal = Number(cartTotal) + shippingCost;

  useEffect(() => {
    const loadShippingQuote = async () => {
      if (!shipping.communeId) {
        setShippingQuote(null);
        setShippingError("");
        return;
      }

      try {
        setLoadingShipping(true);
        setShippingError("");
        setOrderError("");

        const quote = await getShippingQuote({
          communeId: shipping.communeId,
        });

        setShippingQuote(quote);
      } catch (error) {
        console.error("Error calculando envío:", error);

        setShippingQuote(null);
        setShippingError(
          "No se pudo calcular el envío."
        );
      } finally {
        setLoadingShipping(false);
      }
    };

    loadShippingQuote();
  }, [shipping.communeId]);

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;

    setCustomer((previousCustomer) => ({
      ...previousCustomer,
      [name]: value,
    }));

    setOrderError("");
  };

  const handleShippingChange = (event) => {
    const { name, value } = event.target;

    setOrderError("");

    setShipping((previousShipping) => {
      if (name === "regionId") {
        return {
          ...previousShipping,
          regionId: value,
          provinceId: "",
          communeId: "",
        };
      }

      if (name === "provinceId") {
        return {
          ...previousShipping,
          provinceId: value,
          communeId: "",
        };
      }

      return {
        ...previousShipping,
        [name]: value,
      };
    });
  };

  const handleSubmitOrder = async () => {
    if (processingOrder) {
      return;
    }

    if (!customer.name.trim()) {
      setOrderError(
        "Debes ingresar el nombre del cliente."
      );
      return;
    }

    if (!customer.email.trim()) {
      setOrderError(
        "Debes ingresar un correo electrónico."
      );
      return;
    }

    if (!customer.phone.trim()) {
      setOrderError(
        "Debes ingresar un teléfono."
      );
      return;
    }

    if (!shipping.address.trim()) {
      setOrderError(
        "Debes ingresar una dirección."
      );
      return;
    }

    if (!shipping.regionId) {
      setOrderError(
        "Debes seleccionar una región."
      );
      return;
    }

    if (!shipping.provinceId) {
      setOrderError(
        "Debes seleccionar una provincia."
      );
      return;
    }

    if (!shipping.communeId) {
      setOrderError(
        "Debes seleccionar una comuna para calcular el despacho."
      );
      return;
    }

    if (loadingShipping) {
      setOrderError(
        "Espera mientras terminamos de calcular el despacho."
      );
      return;
    }

    if (!shippingQuote?.available) {
      setOrderError(
        "No se pudo calcular el despacho para esta dirección."
      );
      return;
    }

    try {
      setProcessingOrder(true);
      setOrderError("");

      const orderData = buildOrderPayload({
        customer,
        shippingAddress: shipping,
        shippingQuote,
        paymentMethod,
        cartItems,
      });

      const response =
        await createPaymentPreference(orderData);

      const paymentUrl = response.initPoint;

if (!paymentUrl) {
  throw new Error(
    "Mercado Pago no devolvió una dirección para continuar el pago."
  );
}

window.location.assign(paymentUrl);
    } catch (error) {
      console.error(
        "Error registrando pedido:",
        error
      );

      setOrderError(
        error instanceof Error
          ? error.message
          : "No fue posible registrar el pedido."
      );
    } finally {
      setProcessingOrder(false);
    }
  };

  if (confirmedOrder) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "140px 20px 80px",
        }}
      >
        <section
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid #dbe4ee",
            background: "#ffffff",
            boxShadow:
              "0 20px 50px rgba(15, 23, 42, 0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 24px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#166534",
              fontSize: "34px",
              fontWeight: "900",
            }}
          >
            ✓
          </div>

          <p
            style={{
              margin: "0 0 10px",
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Pedido registrado
          </p>

          <h1
            style={{
              margin: "0 0 16px",
              color: "#0f172a",
              fontSize: "clamp(30px, 5vw, 44px)",
              lineHeight: "1.1",
            }}
          >
            Gracias, {confirmedOrder.customerName}
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "560px",
              color: "#475569",
              fontSize: "17px",
              lineHeight: "1.7",
            }}
          >
            Recibimos correctamente tu pedido. Nos
            pondremos en contacto contigo para confirmar
            el pago y coordinar la entrega.
          </p>

          <div
            style={{
              marginTop: "30px",
              padding: "22px",
              borderRadius: "16px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "14px",
              }}
            >
              <span style={{ color: "#64748b" }}>
                Número de pedido
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  overflowWrap: "anywhere",
                  textAlign: "right",
                }}
              >
                {confirmedOrder.orderReference}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "14px",
              }}
            >
              <span style={{ color: "#64748b" }}>
                Correo
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  textAlign: "right",
                }}
              >
                {confirmedOrder.customerEmail}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                paddingTop: "14px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  color: "#0f172a",
                  fontWeight: "800",
                }}
              >
                Total del pedido
              </span>

              <strong
                style={{
                  color: "#0f172a",
                  fontSize: "20px",
                }}
              >
                $
                {Number(
                  confirmedOrder.total
                ).toLocaleString("es-CL")}
              </strong>
            </div>
          </div>

          <a
            href="/"
            style={{
              marginTop: "28px",
              display: "inline-flex",
              minHeight: "48px",
              padding: "0 24px",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: "800",
              textDecoration: "none",
            }}
          >
            Volver al inicio
          </a>
        </section>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "120px 20px 80px",
        }}
      >
        <section
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          <h1>Checkout</h1>
          <p>No hay productos en el carrito.</p>
        </section>
      </main>
    );
  }

  const orderButtonDisabled =
    processingOrder ||
    loadingShipping ||
    !shippingQuote?.available;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "120px 20px 80px",
      }}
    >
      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <h1>Finalizar pedido</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 360px",
            gap: "32px",
            alignItems: "start",
            marginTop: "32px",
          }}
        >
          <div>
            <CustomerForm
              customer={customer}
              onChange={handleCustomerChange}
            />

            <ShippingForm
              shipping={shipping}
              onChange={handleShippingChange}
            />

            <PaymentMethods
              paymentMethod={paymentMethod}
              onChange={setPaymentMethod}
            />

            {orderError && (
              <div
                role="alert"
                style={{
                  marginTop: "24px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  fontWeight: "700",
                  lineHeight: "1.5",
                }}
              >
                {orderError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={orderButtonDisabled}
              style={{
                marginTop: "24px",
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                background: processingOrder
                  ? "#64748b"
                  : "#0f172a",
                color: "#ffffff",
                fontWeight: "700",
                cursor: orderButtonDisabled
                  ? "not-allowed"
                  : "pointer",
                opacity: orderButtonDisabled
                  ? 0.7
                  : 1,
              }}
            >
              {processingOrder
                ? "Registrando pedido..."
                : loadingShipping
                  ? "Calculando despacho..."
                  : "Confirmar pedido"}
            </button>

            <p
              style={{
                margin: "12px 0 0",
                color: "#64748b",
                fontSize: "14px",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              Una vez registrado el pedido, nos
              comunicaremos contigo para confirmar el
              pago y la entrega.
            </p>
          </div>

          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            shippingQuote={shippingQuote}
            loadingShipping={loadingShipping}
            shippingError={shippingError}
            checkoutTotal={checkoutTotal}
          />
        </div>
      </section>
    </main>
  );
}

export default CheckoutPage;