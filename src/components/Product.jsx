import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import productImage from "../assets/img/img-producto.png";
import nutritionImage from "../assets/img/Cerebria-Etiqueta_page-0001.jpg";

import "../style/product.css";

function Product() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const listRef = useRef(null);

  const [showNutrition, setShowNutrition] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: 1,
    name: "Cerebria® Jarabe 200ml",
    price: 20000,
    image: productImage,
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    const currentList = listRef.current;

    if (!currentList) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentList.classList.add("show");
          observer.unobserve(currentList);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(currentList);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!showNutrition) return undefined;

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

  const increaseQuantity = () => {
    setQuantity((previousQuantity) => previousQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((previousQuantity) =>
      Math.max(1, previousQuantity - 1)
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      quantity,
    });

    navigate("/carrito");
  };

  const closeNutritionModal = () => {
    setShowNutrition(false);
  };

  return (
    <main className="product-page">
      <section className="product" id="producto">
        <div className="product-container">
          {/* Título del producto */}
          <header className="product-intro">
            <span className="product-eyebrow">
              Producto Cerebria®
            </span>

            <h1>Cerebria® Jarabe 200ml</h1>
          </header>

          {/* Imagen principal */}
          <div className="product-image-column">
            <div className="product-image-box">
              <img
                src={productImage}
                alt="Frasco de suplemento alimentario Cerebria"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-content">
            <p className="product-description">
              Suplemento alimentario formulado con Omega 3, vitaminas y
              minerales, pensado para apoyar la salud cerebral, la memoria y
              la concentración en adultos.
            </p>

            {/* Precio y cantidad */}
            <div className="product-price-row">
              <p className="product-price">
                ${product.price.toLocaleString("es-CL")}
              </p>

              <div className="quantity-box quantity-box-inline">
                <span className="quantity-label">
                  Cantidad
                </span>

                <div className="quantity-control">
                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>

                  <strong
                    className="quantity-number"
                    aria-live="polite"
                  >
                    {quantity}
                  </strong>

                  <button
                    type="button"
                    className="quantity-btn"
                    onClick={increaseQuantity}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div className="ingredients">
              <h2>Ingredientes principales</h2>

              <ul
                className="ingredient-list"
                ref={listRef}
              >
                <li>Omega 3</li>
                <li>Vitaminas esenciales</li>
                <li>Minerales de apoyo nutricional</li>
                <li>Formato líquido de fácil consumo</li>
                <li>No contiene azúcar</li>
              </ul>
            </div>

            {/* Acciones de compra */}
            <div className="product-purchase">
              <button
                type="button"
                className="nutrition-btn"
                onClick={() => setShowNutrition(true)}
              >
                Ver información nutricional
              </button>

              <div className="product-buttons">
                <button
                  type="button"
                  className="product-btn-secondary"
                  onClick={handleAddToCart}
                >
                  Agregar al carrito
                </button>

                <button
                  type="button"
                  className="product-btn"
                  onClick={handleBuyNow}
                >
                  Comprar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de información nutricional */}
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
            <h2
              id="nutrition-modal-title"
              className="nutrition-modal-title"
            >
              Información nutricional
            </h2>

            <button
              type="button"
              className="nutrition-close"
              onClick={closeNutritionModal}
              aria-label="Cerrar información nutricional"
            >
              ×
            </button>

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