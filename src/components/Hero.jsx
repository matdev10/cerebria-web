import '../style/hero.css'
import heroImage from '../assets/img/hero-cerebria.png'

function Hero() {
  return (
    <section className="hero" id="inicio">

      <div className="hero-card">

        <img src={heroImage} alt="Cerebria" className="hero-image" />

        <div className="hero-content">
          <h1>Cerebria®. Tu mente activa, tu vida plena</h1>

          <p>
            Suplemento alimentario con Omega 3, vitaminas y minerales para
            tu salud cerebral.
          </p>
        </div>

        <div className="hero-info">
          {/* lo demás igual */}
        </div>

      </div>

    </section>
  )
}

export default Hero