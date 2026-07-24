import { useNavigate } from "react-router-dom";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <main className="cart-page cart-page--empty">
      <section className="cart-empty">
        <div className="cart-empty__icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="34"
            height="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1" />
            <circle cx="19" cy="20" r="1" />

            <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
        </div>

        <span className="cart-empty__eyebrow">
          Tu compra
        </span>

        <h1>Tu carrito está vacío</h1>

        <p>
          Aún no has agregado productos. Conoce Cerebria® y comienza tu compra
          de forma rápida y segura.
        </p>

        <button
          type="button"
          className="cart-empty__button"
          onClick={() => navigate("/comprar")}
        >
          Ver producto
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}

export default EmptyCart;