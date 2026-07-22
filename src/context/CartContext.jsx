import { createContext, useContext, useEffect, useState } from "react";

import {
  addProductToCart,
  removeProductFromCart,
  increaseQuantity,
  decreaseQuantity,
  calculateCartTotal,
  calculateCartCount,
} from "../services/cart/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("mw_cart");

    if (savedCart) {
      return JSON.parse(savedCart);
    }

    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [shippingMethod, setShippingMethod] = useState("home_delivery");

  const shippingCost =
    shippingMethod === "home_delivery"
      ? 3990
      : shippingMethod === "chilexpress"
      ? 5990
      : 0;

  useEffect(() => {
    localStorage.setItem("mw_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);

  const closeCart = () => setIsCartOpen(false);

  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) =>
      addProductToCart(prevItems, product, quantity)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      removeProductFromCart(prevItems, productId)
    );
  };

  const increaseItemQuantity = (productId) => {
    setCartItems((prevItems) =>
      increaseQuantity(prevItems, productId)
    );
  };

  const decreaseItemQuantity = (productId) => {
    setCartItems((prevItems) =>
      decreaseQuantity(prevItems, productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = calculateCartTotal(cartItems);

  const cartCount = calculateCartCount(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseItemQuantity,
        decreaseItemQuantity,
        clearCart,
        cartTotal,
        cartCount,

        isCartOpen,
        openCart,
        closeCart,
        toggleCart,

        shippingMethod,
        setShippingMethod,
        shippingCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}