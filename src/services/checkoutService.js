export const calculateSubtotal = (cartItems = []) => {
  return cartItems.reduce((total, item) => {
    return total + Number(item.price) * Number(item.quantity);
  }, 0);
};

export const calculateCheckoutTotal = (
  subtotal = 0,
  shippingCost = 0
) => {
  return Number(subtotal) + Number(shippingCost);
};

export const buildOrderPayload = ({
  customer,
  shippingAddress,
  shippingQuote,
  paymentMethod,
  cartItems = [],
}) => {
  const subtotal = calculateSubtotal(cartItems);

  const shippingCost = shippingQuote?.available
    ? Number(shippingQuote.cost)
    : 0;

  const total = calculateCheckoutTotal(subtotal, shippingCost);

  const items = cartItems.map((item) => ({
    productId: String(item.id),
    name: item.name,
    description: item.description || item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    subtotal: Number(item.price) * Number(item.quantity),
  }));

  return {
    customer,
    shippingAddress,

    // El backend de pagos espera esta propiedad en el nivel principal.
    shippingQuote,

    shippingCost,
    paymentMethod,
    items,
    subtotal,
    total,

    // Conservamos este objeto para el registro futuro de la orden.
    shipping: {
      method: shippingQuote?.shippingMethod || null,
      carrier: shippingQuote?.carrier || null,
      label: shippingQuote?.label || null,
      cost: shippingCost,
      quote: shippingQuote || null,
    },
  };
};