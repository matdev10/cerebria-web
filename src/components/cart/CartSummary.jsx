import { useNavigate } from "react-router-dom";
import "./CartSummary.css";

function CartSummary({ cartTotal = 0, onClearCart }) {
  const navigate = useNavigate();

  const goToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <aside className="cart-summary">
      <span className="cart-summary-tag">Resumen</span>

      <h2>Tu pedido</h2>

      <div className="cart-summary-row">
        <span>Subtotal</span>
        <strong>${cartTotal.toLocaleString("es-CL")}</strong>
      </div>

      <div className="cart-summary-note">
        <p>
          El despacho se calculará automáticamente en el checkout según tu
          región, provincia y comuna.
        </p>
      </div>

      <button
        type="button"
        className="cart-summary-primary"
        onClick={goToCheckout}
      >
        Ir al checkout
      </button>

      <button
        type="button"
        className="cart-summary-secondary"
        onClick={onClearCart}
      >
        Vaciar carrito
      </button>
    </aside>
  );
}

export default CartSummary;