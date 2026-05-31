import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react'
import '../style/contact.css'
import { FaWhatsapp } from 'react-icons/fa'
import { IoLocationSharp } from 'react-icons/io5'

function Contact() {
  const form = useRef()

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const sendEmail = (e) => {
    e.preventDefault()
    setLoading(true)

    emailjs.sendForm(
      'service_sp6bsfa',
      'template_r6os5r4',
      form.current,
      'r1NHW9bxDdvOxnULg'
    )
      .then(() => {
        setStatus('success')
        setLoading(false)
        e.target.reset()

        setTimeout(() => {
          setStatus('')
        }, 4000)
      })
      .catch((error) => {
        console.log(error)
        setStatus('error')
        setLoading(false)

        setTimeout(() => {
          setStatus('')
        }, 4000)
      })
  }

  return (
    <section className="contact" id="contacto">
      <div className="contact-container">

        <div className="contact-info">
          <span>Contacto</span>

          <h2>Solicita información sobre Cerebria®</h2>

          <p>
            Si deseas más información sobre el producto,
            ingredientes o disponibilidad, puedes comunicarte
            directamente con nosotros.
          </p>

          <div className="contact-data">

            <div className="contact-card">
              <div className="contact-icon">
                <FaWhatsapp />
              </div>

              <div className="contact-text">
                <strong>WhatsApp</strong>
                <p>+56 9 9996 0995</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <IoLocationSharp />
              </div>

              <div className="contact-text">
                <strong>Ubicación </strong>
                <p>Santiago, Chile. </p>
              </div>
            </div>

          </div>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="contact-form"
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
          />

          <textarea
            name="message"
            placeholder="Escribe tu mensaje..."
            rows="5"
            required
          ></textarea>

          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar consulta'}
          </button>

          {status === 'success' && (
            <div className="contact-alert success">
              ✓ Consulta enviada correctamente
            </div>
          )}

          {status === 'error' && (
            <div className="contact-alert error">
              Ocurrió un error al enviar la consulta
            </div>
          )}
        </form>

      </div>
    </section>
  )
}

export default Contact