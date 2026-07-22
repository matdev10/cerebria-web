import "../style/navbar.css";
import logo from "../assets/img/logo.png";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Cerebria" />
        </Link>

        <nav className="nav-links">
          <a href="/#inicio">Inicio</a>
          <a href="/#beneficios">Beneficios</a>
          <Link to="/producto">Producto</Link>
          <a href="/#contacto">Contacto</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/carrito" className="cart-btn">
            🛒 Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <a href="/#contacto" className="nav-btn">
            Consultar
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;