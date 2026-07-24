import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import nutritionImage from "../assets/img/Cerebria-Etiqueta_page-0001.jpg";

import "../style/product.css";

const ingredients = [
  "Omega 3",
  "Vitaminas esenciales",
  "Minerales de apoyo nutricional",
  "Formato líquido de fácil consumo",
  "No contiene azúcar",
];

function Product() {
  const [showNutrition, setShowNutrition] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  useEffect(() => {
    if (!showNutrition) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowNutrition(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNutrition]);

  const openNutritionModal = () => {
    setShowNutrition(true);
  };

  const closeNutritionModal = () => {
    setShowNutrition(false);
  };

  return (
    <main className="product-page">
      <section
        className="product-details"
        id="producto"
      >
        <div className="product-details__container">
          <header className="product-details__header">
            <span>Información del producto</span>

            <h1>
              Conoce su composición y presentación
            </h1>

            <p>
              Revisa las características principales de Cerebria® antes de
              continuar hacia la página de compra.
            </p>
          </header>

          <div className="product-details__layout">
            <article className="product-composition">
              <span className="product-details__label">
                Composición
              </span>

              <h2>Ingredientes principales</h2>

              <ul className="product-composition__list">
                {ingredients.map((ingredient) => (
                  <li key={ingredient}>
                    <span aria-hidden="true">✓</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </article>

            <aside className="product-presentation">
              <span className="product-details__label">
                Presentación
              </span>

              <h2>Información general</h2>

              <dl className="product-presentation__list">
                <div>
                  <dt>Contenido</dt>
                  <dd>200 ml</dd>
                </div>

                <div>
                  <dt>Formato</dt>
                  <dd>Jarabe líquido</dd>
                </div>

                <div>
                  <dt>Uso</dt>
                  <dd>Rutina diaria</dd>
                </div>

                <div>
                  <dt>Dirigido a</dt>
                  <dd>Adultos</dd>
                </div>
              </dl>

              <button
                type="button"
                className="product-presentation__button"
                onClick={openNutritionModal}
              >
                Consultar información nutricional
              </button>
            </aside>
          </div>

          <div className="product-details__cta">
            <div>
              <span>¿Quieres adquirir Cerebria®?</span>

              <p>
                Consulta el precio, stock disponible y opciones de despacho.
              </p>
            </div>

            <Link
              to="/comprar"
              className="product-details__cta-button"
            >
              Ir a la página de compra
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {showNutrition && (
        <div
          className="nutrition-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nutrition-modal-title"
          onClick={closeNutritionModal}
        >
          <div
            className="nutrition-box"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="nutrition-modal-header">
              <div>
                <span>Producto Cerebria®</span>

                <h2 id="nutrition-modal-title">
                  Información nutricional
                </h2>
              </div>

              <button
                type="button"
                className="nutrition-close"
                onClick={closeNutritionModal}
                aria-label="Cerrar información nutricional"
              >
                ×
              </button>
            </header>

            <img
              src={nutritionImage}
              alt="Tabla de información nutricional de Cerebria"
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Product;