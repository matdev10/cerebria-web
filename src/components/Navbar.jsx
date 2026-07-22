import { useState } from "react";
import "../style/navbar.css";
import logo from "../assets/img/logo-blanco.png";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";

function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Cerebria" />
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="/#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="/#beneficios" onClick={() => setMenuOpen(false)}>Beneficios</a>
          <Link to="/producto" onClick={() => setMenuOpen(false)}>Producto</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/carrito" className="cart-btn">
            <ShoppingCart />
            Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;