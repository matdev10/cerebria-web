import '../style/hero.css'
import { Package, Brain, Sparkles, Users } from 'lucide-react'

function Hero() {
  return (
    <section className="hero" id="inicio">

      <div className="hero-card">

        <div className="hero-content">
          <h1>Cerebria®. Tu mente activa, tu vida plena</h1>

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