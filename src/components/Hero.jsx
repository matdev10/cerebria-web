import '../style/hero.css'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-card">

        <div className="hero-content">
<h1>
  <span className="cerebria-font">Cerebria®</span>

  <span className="hero-line">
    Tu mente activa, tu vida plena
  </span>
</h1>
          <p>
            Suplemento alimentario con Omega 3, vitaminas y minerales para
            tu salud cerebral.
          </p>
        </div>

        <div className="hero-info">
          <div>
            <span>Formato</span>
            <strong>Jarabe líquido 200ml</strong>
          </div>

          <div>
            <span>Dosis</span>
            <strong>10ml diarios</strong>
          </div>

          <div>
            <span>Rutina</span>
            <strong>Uso diario</strong>
          </div>

          <div>
            <span>Público</span>
            <strong>Adultos</strong>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero