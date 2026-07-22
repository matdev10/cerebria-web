import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import productImage from "../assets/img/img-producto.png";
import { useCart } from "../context/CartContext";

function BuyPage() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();
        setProduct(products[0]);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, []);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
  addToCart(product, quantity);
  openCart();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/carrito");
  };

  if (loading) {
    return <main style={{ padding: "80px 20px" }}>Cargando producto...</main>;
  }

  if (!product) {
    return <main style={{ padding: "80px 20px" }}>No se encontró el producto.</main>;
  }

  const subtotal = product.price * quantity;

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "80px 20px" }}>
      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1>Comprar Cerebria®</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "40px" }}>
          <div>
            <img
              src={productImage}
              alt={product.name}
              style={{ width: "100%", maxWidth: "420px" }}
            />
          </div>

          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>

            <h3>${product.price.toLocaleString("es-CL")}</h3>

            <div>
              <button onClick={decreaseQuantity}>-</button>
              <span style={{ margin: "0 16px" }}>{quantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>

            <hr />

            <h3>Resumen</h3>
            <p>Cantidad: {quantity}</p>
            <p>Subtotal: ${subtotal.toLocaleString("es-CL")}</p>

            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Agregar al carrito
              </button>

              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#0f172a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BuyPage;