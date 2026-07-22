import { FaWhatsapp } from 'react-icons/fa'
import '../style/whatsapp.css'

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/56999960995"
      className="whatsapp-float"
      target="_blank"
      rel="noreferrer"
    >
      <FaWhatsapp />
      <span className="wa-tooltip">¿Necesitas ayuda?</span>
    </a>
  )
}

export default WhatsAppButton