import { useNavigate } from "react-router-dom";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <h1>Carrito</h1>
      <p>Tu carrito está vacío.</p>

      <button onClick={() => navigate("/comprar")}>
        Seguir comprando
      </button>
    </main>
  );
}

export default EmptyCart;