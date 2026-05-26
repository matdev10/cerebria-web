import '../style/reviews.css'

function Reviews() {
  return (
    <section className="reviews" id="reseñas">
      <div className="reviews-container">

        <div className="reviews-header">
          <span>Opiniones reales</span>
          <h2>Personas que ya confían en Cerebria®</h2>
          <p>
            Experiencias de usuarios que incorporaron Cerebria® como apoyo
            diario para su memoria, concentración y bienestar.
          </p>
        </div>

        <div className="reviews-grid">
          <article className="review-card featured">
            <div className="review-stars">★★★★★</div>
            <p>
              “Me gustó porque es fácil de tomar y lo incorporé rápido a mi rutina.
              Se siente como un apoyo diario muy práctico.”
            </p>
            <div className="review-user">
              <strong>María González</strong>
              <span>Usuaria verificada</span>
            </div>
          </article>

          <article className="review-card">
            <div className="review-stars">★★★★★</div>
            <p>
              “Lo compré para mi papá y le acomodó bastante el formato líquido.
              Buena presentación y fácil consumo.”
            </p>
            <div className="review-user">
              <strong>Carlos Muñoz</strong>
              <span>Cliente Cerebria®</span>
            </div>
          </article>

          <article className="review-card">
            <div className="review-stars">★★★★☆</div>
            <p>
              “Me parece una alternativa cómoda para adultos que buscan mantener
              una rutina de bienestar.”
            </p>
            <div className="review-user">
              <strong>Andrea Silva</strong>
              <span>Compra reciente</span>
            </div>
          </article>
        </div>

      </div>
    </section>
  )
}

export default Reviews