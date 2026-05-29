import '../style/navbar.css'
import logo from '../assets/img/logo.png'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <div className="logo">
          <img src={logo} alt="Cerebria"/>
        </div>

        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#producto">Producto</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <a href="#" className="nav-btn">
          Consultar
        </a>

      </div>
    </header>
  )
}

export default Navbar