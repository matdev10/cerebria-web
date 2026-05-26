import adultoMayor from '../assets/img/adulto-mayor2.png'
import '../style/lifestyle.css'

function Lifestyle() {
  return (
    <section className="lifestyle">
      <div className="lifestyle-container">

        <div className="lifestyle-content">
          <span>Bienestar diario</span>

          <h2>Mantén tu mente activa cada día</h2>

          <p>
            Cerebria® fue pensado para adultos que buscan apoyar
            su memoria, concentración y bienestar cognitivo con
            una fórmula práctica y fácil de consumir.
          </p>

          <div className="lifestyle-points">
            <div className="point-card point-animate">
              <strong>Memoria</strong>
              <p>Apoyo diario para mantener claridad mental.</p>
            </div>

            <div className="point-card point-animate">
              <strong>Concentración</strong>
              <p>Ideal para rutinas activas y enfoque cotidiano.</p>
            </div>

            <div className="point-card point-animate">
              <strong>Formato práctico</strong>
              <p>Jarabe fácil de consumir y sin azúcar.</p>
            </div>
          </div>
        </div>
        

<div className="lifestyle-image-wrapper">

  <span className="memory-phrase">
    “Yo no te olvido”
  </span>

  <div className="lifestyle-image">
    <img
      src={adultoMayor}
      alt="Adulto mayor utilizando Cerebria"
    />
  </div>

</div>

      </div>
    </section>
  )
}

export default Lifestyle