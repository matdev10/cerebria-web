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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && listRef.current) {
          listRef.current.classList.add("show");
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      if (prev <= 1) return 1;
      return prev - 1;
    });
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

  return (
    <section className="product" id="producto">
      <div className="product-container">
        <div className="product-image-box">
          <img src={productImage} alt="Frasco Cerebria" />
        </div>

        <div className="product-content">
          <span>Producto</span>

          <h2>Cerebria® Jarabe 200ml</h2>

          <p>
            Suplemento alimentario formulado con Omega 3, vitaminas y minerales,
            pensado para apoyar la salud cerebral, la memoria y la concentración
            en adultos.
          </p>

          <h3 style={{ marginTop: "20px", fontSize: "28px" }}>
            ${product.price.toLocaleString("es-CL")}
          </h3>

          <div className="ingredients">
            <h3>Ingredientes principales</h3>

            <ul className="ingredient-list" ref={listRef}>
              <li>Omega 3</li>
              <li>Vitaminas esenciales</li>
              <li>Minerales de apoyo nutricional</li>
              <li>Formato líquido de fácil consumo</li>
              <li>No contiene azúcar</li>
            </ul>
          </div>

          <div className="product-image-mobile">
            <img src={productImage} alt="Frasco Cerebria" />
          </div>

          <div className="quantity-box">
  <span className="quantity-label">Cantidad</span>

  <div className="quantity-control">
    <button
      type="button"
      className="quantity-btn"
      onClick={decreaseQuantity}
      disabled={quantity === 1}
    >
      −
    </button>

    <strong className="quantity-number">{quantity}</strong>

    <button
      type="button"
      className="quantity-btn"
      onClick={increaseQuantity}
    >
      +
    </button>
  </div>
</div>

          <div className="product-buttons">
            <button
              type="button"
              className="nutrition-btn"
              onClick={() => setShowNutrition(true)}
            >
              Ver información nutricional
            </button>

            <button
              type="button"
              className="product-btn"
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

      {showNutrition && (
        <div className="nutrition-modal">
          <div className="nutrition-box">
            <button
              className="nutrition-close"
              onClick={() => setShowNutrition(false)}
            >
              ×
            </button>

            <img src={nutritionImage} alt="Información nutricional Cerebria" />
          </div>
        </div>
      )}
    </section>
  );
}

export default Product;