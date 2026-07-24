import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

import { FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

import "../style/contact.css";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const contactChannels = [
  {
    id: "whatsapp-primary",
    label: "WhatsApp principal",
    title: "Ventas y consultas",
    value: "+56 9 4563 1732",
    href: "https://wa.me/56945631732",
    action: "Abrir conversación",
    external: true,
    Icon: FaWhatsapp,
  },
  {
    id: "whatsapp-secondary",
    label: "WhatsApp alternativo",
    title: "Atención alternativa",
    value: "+56 9 2160 4900",
    href: "https://wa.me/56921604900",
    action: "Abrir conversación",
    external: true,
    Icon: FaWhatsapp,
  },
  {
    id: "email",
    label: "Correo electrónico",
    title: "Consultas por correo",
    value: "contacto@aligal.cl",
    href: "mailto:contacto@aligal.cl",
    action: "Enviar correo",
    external: false,
    Icon: FaEnvelope,
  },
  {
    id: "location",
    label: "Ubicación",
    title: "Zona de atención",
    value: "Santiago, Chile",
    href: null,
    action: null,
    external: false,
    Icon: IoLocationSharp,
  },
];

function ContactCard({
  label,
  title,
  value,
  href,
  action,
  external,
  Icon,
}) {
  const CardElement = href ? "a" : "article";

  return (
    <CardElement
      className={`contact-card ${
        href ? "contact-card--link" : "contact-card--static"
      }`}
      href={href || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={href ? `${title}: ${value}` : undefined}
    >
      <div className="contact-icon" aria-hidden="true">
        <Icon />
      </div>

      <div className="contact-card__content">
        <span className="contact-card__label">
          {label}
        </span>

        <strong className="contact-card__title">
          {title}
        </strong>

        <span className="contact-card__value">
          {value}
        </span>

        {action && (
          <span className="contact-card__action">
            {action}
            <span aria-hidden="true">↗</span>
          </span>
        )}
      </div>
    </CardElement>
  );
}

function Contact() {
  const form = useRef(null);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const clearStatusLater = () => {
    window.setTimeout(() => {
      setStatus("");
    }, 4000);
  };

  const sendEmail = async (event) => {
    event.preventDefault();

    if (
      !EMAILJS_SERVICE_ID ||
      !EMAILJS_TEMPLATE_ID ||
      !EMAILJS_PUBLIC_KEY
    ) {
      console.error(
        "Faltan variables de configuración de EmailJS."
      );

      setStatus("error");
      clearStatusLater();
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form.current,
        EMAILJS_PUBLIC_KEY
      );

      form.current?.reset();
      setStatus("success");
    } catch (error) {
      console.error(
        "Error al enviar el formulario:",
        error
      );

      setStatus("error");
    } finally {
      setLoading(false);
      clearStatusLater();
    }
  };

  return (
    <section className="contact" id="contacto">
      <div className="contact-container">
        <div className="contact-info">
          <span className="contact-eyebrow">
            Contacto
          </span>

          <h2>
            Conversemos sobre Cerebria®
          </h2>

          <p className="contact-description">
            Resuelve tus dudas sobre el producto, sus ingredientes,
            disponibilidad y alternativas de despacho. Elige el canal
            de atención que te resulte más cómodo.
          </p>

          <div className="contact-data">
            {contactChannels.map((channel) => (
              <ContactCard
                key={channel.id}
                {...channel}
              />
            ))}
          </div>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          className="contact-form"
          aria-busy={loading}
        >
          <header className="contact-form__header">
            <span>Formulario de contacto</span>

            <h3>Envíanos tu consulta</h3>

            <p>
              Completa tus datos y te responderemos a la brevedad.
            </p>
          </header>

          <div className="contact-field">
            <label htmlFor="contact-name">
              Nombre
            </label>

            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Ej. Camila González"
              autoComplete="name"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">
              Correo electrónico
            </label>

            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="nombre@correo.cl"
              autoComplete="email"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">
              Mensaje
            </label>

            <textarea
              id="contact-message"
              name="message"
              placeholder="Cuéntanos cómo podemos ayudarte..."
              rows="5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Enviando consulta..."
              : "Enviar consulta"}
          </button>

          {status === "success" && (
            <div
              className="contact-alert contact-alert--success"
              role="status"
            >
              <span aria-hidden="true">✓</span>
              Consulta enviada correctamente.
            </div>
          )}

          {status === "error" && (
            <div
              className="contact-alert contact-alert--error"
              role="alert"
            >
              No pudimos enviar tu consulta. Inténtalo nuevamente.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;