export function normalizeCartItem(product, quantity = 1) {
  return {
    id: product.id,

    sku: product.sku ?? null,
    slug: product.slug ?? null,

    name: product.name,

    shortDescription:
      product.shortDescription ??
      product.description ??
      "",

    image:
      product.imageUrl ??
      product.image ??
      null,

    price: product.price,

    comparePrice: product.comparePrice ?? null,

    quantity,

    stock: product.stock ?? 0,
    weight: product.weight ?? null,

    vendor: product.vendor ?? null,
    category: product.category ?? null,

    taxable: product.taxable ?? true,
  };
}

export function addProductToCart(cartItems, product, quantity = 1) {
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    return cartItems.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cartItems, normalizeCartItem(product, quantity)];
}

export function removeProductFromCart(cartItems, productId) {
  return cartItems.filter((item) => item.id !== productId);
}

export function increaseQuantity(cartItems, productId) {
  return cartItems.map((item) =>
    item.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );
}

export function decreaseQuantity(cartItems, productId) {
  return cartItems.map((item) =>
    item.id === productId && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );
}

export function calculateCartTotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function calculateCartCount(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
}