import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";

import { useCart } from "../context/CartContext";

import logo from "../assets/img/logo-blanco.png";
import "../style/navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Cerebria"
          />
        </Link>

        <nav
          className={`nav-links ${menuOpen ? "open" : ""}`}
          aria-label="Navegación principal"
        >
          <a
            href="/#inicio"
            onClick={closeMenu}
          >
            Inicio
          </a>

          <a
            href="/#beneficios"
            onClick={closeMenu}
          >
            Beneficios
          </a>

          <Link
            to="/comprar"
            onClick={closeMenu}
          >
            Producto
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link
            to="/carrito"
            className="cart-btn"
            onClick={closeMenu}
          >
            <ShoppingCart aria-hidden="true" />

            <span>Carrito</span>

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() =>
              setMenuOpen((previousState) => !previousState)
            }
            aria-label={
              menuOpen
                ? "Cerrar menú"
                : "Abrir menú"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`nav-backdrop ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-label="Cerrar menú"
      />
    </header>
  );
}

export default Navbar;