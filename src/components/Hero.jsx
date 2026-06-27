import '../style/hero.css'
import heroPremium from '../assets/img/hero-cerebria-premium.png'

import {
  PillBottle,
  Droplets,
  CalendarDays,
  Users
} from 'lucide-react'

function Hero() {
  return (
    <section className="hero" id="inicio">

      <img
        className="hero-full-image"
        src={heroPremium}
        alt="Cerebria suplemento alimentario"
      />

      <div className="hero-copy">
        <h1>
          <span className="cerebria-font">Cerebria®</span>
          <span className="hero-line">Tu mente activa, tu vida plena</span>
        </h1>

        <p>
          Suplemento alimentario con Omega 3, vitaminas y minerales para tu salud cerebral.
        </p>
      </div>

      <div className="hero-info">
        <div className="hero-info-item">
          <PillBottle className="hero-icon" />
          <strong>Formato</strong>
          <small>Jarabe líquido 200ml</small>
        </div>

        <div className="hero-info-item">
          <Droplets className="hero-icon" />
          <strong>Dosis</strong>
          <small>10ml diarios</small>
        </div>

        <div className="hero-info-item">
          <CalendarDays className="hero-icon" />
          <strong>Rutina</strong>
          <small>Uso diario</small>
        </div>

        <div className="hero-info-item">
          <Users className="hero-icon" />
          <strong>Público</strong>
          <small>Adultos</small>
        </div>
      </div>

    </section>
  )
}

export default Hero