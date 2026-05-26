import productImage from '../assets/img/hero-cerebria.png'
import '../style/product.css'
import { useEffect, useRef } from 'react'

function Product() {

  const listRef = useRef(null)

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

          <a href="#contacto" className="product-btn">
            Solicitar información
          </a>

        </div>
      </div>
    </section>
  )
}

export default Product