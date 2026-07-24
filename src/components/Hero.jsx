import { Link } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Droplets,
  PillBottle,
  Users,
} from "lucide-react";

import heroPremium from "../assets/img/hero-cerebria-premium.jpg";
import heroMobil from "../assets/img/hero-cerebria-mobil2.png";

import "../style/hero.css";

const productDetails = [
  {
    id: "format",
    title: "Formato",
    description: "Jarabe líquido 200 ml",
    Icon: PillBottle,
  },
  {
    id: "dose",
    title: "Dosis",
    description: "10 ml diarios",
    Icon: Droplets,
  },
  {
    id: "routine",
    title: "Rutina",
    description: "Uso diario",
    Icon: CalendarDays,
  },
  {
    id: "audience",
    title: "Público",
    description: "Adultos",
    Icon: Users,
  },
];

function Hero() {
  return (
    <section className="hero" id="inicio">
      <picture className="hero-picture">
        <source
          media="(max-width: 768px)"
          srcSet={heroMobil}
        />

        <img
          className="hero-full-image"
          src={heroPremium}
          alt="Cerebria, suplemento alimentario en formato de jarabe"
        />
      </picture>

      <div className="hero-container">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            Bienestar para tu día a día
          </span>

          <h1>
            <span className="cerebria-font">
              Cerebria®
            </span>

            <span className="hero-line">
              Tu mente activa,
              <br />
              tu vida plena
            </span>
          </h1>

          <p className="hero-description">
            Suplemento alimentario con Omega 3, vitaminas y minerales,
            desarrollado para complementar tu rutina diaria.
          </p>

          <div className="hero-actions">
            <Link
              to="/comprar"
              className="hero-buy-btn"
            >
              Comprar ahora

              <ArrowRight
                className="hero-button-icon"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/producto"
              className="hero-secondary-btn"
            >
              Conocer el producto
            </Link>
          </div>

          <p className="hero-shipping-note">
            Despacho en Santiago y envíos a regiones.
          </p>
        </div>
      </div>

      <div className="hero-info">
        {productDetails.map(({ id, title, description, Icon }) => (
          <div
            key={id}
            className="hero-info-item"
          >
            <div className="hero-icon-wrap">
              <Icon
                className="hero-icon"
                aria-hidden="true"
              />
            </div>

            <div className="hero-info-content">
              <strong>{title}</strong>
              <small>{description}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;