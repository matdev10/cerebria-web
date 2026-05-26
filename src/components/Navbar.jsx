import '../style/navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <div className="logo">
          Cerebria
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