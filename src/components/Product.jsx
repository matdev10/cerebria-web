import productImage from '../assets/img/producto.png'
import nutritionImage from '../assets/img/etiqueta.jpg'

import '../style/product.css'

import { useEffect, useRef, useState } from 'react'

function Product() {

  const listRef = useRef(null)

  const [showNutrition, setShowNutrition] = useState(false)

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {

        if(entry.isIntersecting){
          listRef.current.classList.add('show')
        }

      },
      {
        threshold: 0.3
      }
    )

    if(listRef.current){
      observer.observe(listRef.current)
    }

    return () => observer.disconnect()

  }, [])

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
            Suplemento alimentario formulado con Omega 3,
            vitaminas y minerales, pensado para apoyar la
            salud cerebral, la memoria y la concentración
            en adultos.
          </p>

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

          <div className="product-buttons">

            <button
              type="button"
              className="nutrition-btn"
              onClick={() => setShowNutrition(true)}
            >
              Ver información nutricional
            </button>

            <a href="#contacto" className="product-btn">
              Solicitar información
            </a>

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

            <img
              src={nutritionImage}
              alt="Información nutricional Cerebria"
            />

          </div>

        </div>

      )}

    </section>
  )
}

export default Product