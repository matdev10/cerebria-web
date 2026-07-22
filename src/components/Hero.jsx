import "../style/hero.css";
import heroPremium from "../assets/img/hero-cerebria-premium.jpg";
import { Link } from "react-router-dom";

import {
  PillBottle,
  Droplets,
  CalendarDays,
  Users,
} from "lucide-react";

function Hero() {
  return (
    <>
      <section className="hero" id="inicio">
        <img
          className="hero-full-image"
          alt="Cerebria suplemento alimentario"
          src={heroPremium}
        />

        <div className="hero-copy">
          <h1>
            <span className="cerebria-font">Cerebria®</span>
            <span className="hero-line">Tu mente activa, tu vida plena</span>
          </h1>
          <p>
            Suplemento alimentario con Omega 3, vitaminas y minerales
            para tu salud cerebral.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/producto" className="hero-buy-btn">
            Comprar Cerebria
          </Link>
        </div>
      </section>

      <div className="hero-info">
        <div className="hero-info-item">
          <div className="hero-icon-wrap">
            <PillBottle className="hero-icon" />
          </div>
          <div>
            <strong>Formato</strong>
            <small>Jarabe líquido 200ml</small>
          </div>
        </div>

        <div className="hero-info-item">
          <div className="hero-icon-wrap">
            <Droplets className="hero-icon" />
          </div>
          <div>
            <strong>Dosis</strong>
            <small>10ml diarios</small>
          </div>
        </div>

        <div className="hero-info-item">
          <div className="hero-icon-wrap">
            <CalendarDays className="hero-icon" />
          </div>
          <div>
            <strong>Rutina</strong>
            <small>Uso diario</small>
          </div>
        </div>

        <div className="hero-info-item">
          <div className="hero-icon-wrap">
            <Users className="hero-icon" />
          </div>
          <div>
            <strong>Público</strong>
            <small>Adultos</small>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;