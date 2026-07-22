import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartDrawer.css";

function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    cartTotal,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const goToCart = () => {
    closeCart();
    navigate("/carrito");
  };

  return (
    <>
      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}></div>
      )}

      <aside className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>🛒 Mi carrito</h2>

          <button onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item) => (
              <div className="drawer-item" key={item.id}>
                <h4>{item.name}</h4>

                <p className="drawer-price">
                  ${item.price.toLocaleString("es-CL")}
                </p>

                <div className="drawer-quantity">
                  <button onClick={() => decreaseItemQuantity(item.id)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseItemQuantity(item.id)}>
                    +
                  </button>
                </div>

                <p className="drawer-subtotal">
                  Subtotal: ${(item.price * item.quantity).toLocaleString("es-CL")}
                </p>

                <button
                  className="drawer-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <h3>Total: ${cartTotal.toLocaleString("es-CL")}</h3>

          <button className="secondary-btn" onClick={closeCart}>
            Seguir comprando
          </button>

          <button className="checkout-btn" onClick={goToCart}>
            Ir al carrito
          </button>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;