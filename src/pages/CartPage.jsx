import { useCart } from "../context/CartContext";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";

import "../style/cart-page.css";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    cartTotal,
    increaseItemQuantity,
    decreaseItemQuantity,
  } = useCart();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="cart-page">
      <section className="cart-page-container">
        <div className="cart-page-header">
          <span>Carrito</span>
          <h1>Carrito de compras</h1>
          <p>
            Revisa tus productos antes de continuar al checkout. El despacho se
            calculará automáticamente según tu comuna en el siguiente paso.
          </p>
        </div>

        <div className="cart-page-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseItemQuantity}
                onDecrease={decreaseItemQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <CartSummary cartTotal={cartTotal} onClearCart={clearCart} />
        </div>
      </section>
    </main>
  );
}

export default CartPage;