import { useEffect } from 'react'
import { Brain, Focus, Activity, Leaf } from 'lucide-react'
import '../style/benefits.css'

function Benefits() {

  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-fall')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.25 }
    )

    elements.forEach(element => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const benefits = [
    {
      icon: <Brain size={34} strokeWidth={2.2} />,
      title: 'Memoria',
      text: 'Apoya la claridad mental y ayuda a mantener activos los recuerdos del día a día.'
    },
    {
      icon: <Focus size={34} strokeWidth={2.2} />,
      title: 'Concentración',
      text: 'Favorece el enfoque diario gracias a su combinación de Omega 3, vitaminas y minerales.'
    },
    {
      icon: <Activity size={34} strokeWidth={2.2} />,
      title: 'Salud cerebral',
      text: 'Contribuye al bienestar cognitivo y al cuidado del sistema nervioso.'
    },
    {
      icon: <Leaf size={34} strokeWidth={2.2} />,
      title: 'Sin azúcar',
      text: 'Formato líquido fácil de consumir, ideal para una rutina práctica y constante.'
    }
  ]

  return (
    <section className="benefits" id="beneficios">

      <div className="section-header scroll-fall">
        <span>BENEFICIOS</span>
        <h2>Apoyo diario para tu mente</h2>
        <p>
          Cerebria® acompaña tu bienestar cognitivo con una fórmula pensada
          para memoria, concentración y salud cerebral.
        </p>
      </div>

      <div className="benefits-grid">
        {benefits.map((item, index) => (
          <article
            className="benefit-card scroll-fall"
            style={{ transitionDelay: `${index * 0.12}s` }}
            key={index}
          >
            <div className="benefit-top">
              <div className="benefit-icon">
                {item.icon}
              </div>

              <span className="benefit-number">
                0{index + 1}
              </span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <div className="benefit-line"></div>
          </article>
        ))}
      </div>

    </section>
  )
}

export default Benefits