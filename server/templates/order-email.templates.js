import process from "node:process";
import { Resend } from "resend";

const resendApiKey =
  process.env.RESEND_API_KEY?.trim();

const emailFrom =
  process.env.EMAIL_FROM?.trim();

const emailAdmin =
  process.env.EMAIL_ADMIN?.trim();

const emailReplyTo =
  process.env.EMAIL_REPLY_TO?.trim();

let resendClient = null;

const validateEmailConfiguration = () => {
  const missingVariables = [];

  if (!resendApiKey) {
    missingVariables.push("RESEND_API_KEY");
  }

  if (!emailFrom) {
    missingVariables.push("EMAIL_FROM");
  }

  if (!emailAdmin) {
    missingVariables.push("EMAIL_ADMIN");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de correo: ${missingVariables.join(", ")}`
    );
  }
};

const getResendClient = () => {
  validateEmailConfiguration();

  if (!resendClient) {
    resendClient = new Resend(resendApiKey);
  }

  return resendClient;
};

export const getAdminEmail = () => {
  validateEmailConfiguration();

  return emailAdmin;
};

export const sendTransactionalEmail = async ({
  to,
  subject,
  html,
  text,
  idempotencyKey = null,
}) => {
  if (!to) {
    throw new Error(
      "El correo debe tener al menos un destinatario"
    );
  }

  if (!subject) {
    throw new Error(
      "El correo debe tener un asunto"
    );
  }

  if (!html && !text) {
    throw new Error(
      "El correo debe tener contenido HTML o texto"
    );
  }

  const recipients = Array.isArray(to)
    ? to
    : [to];

  const payload = {
    from: emailFrom,
    to: recipients,
    subject,
    html,
    text,
  };

  if (emailReplyTo) {
    payload.replyTo = emailReplyTo;
  }

  const resend = getResendClient();

  const response = idempotencyKey
    ? await resend.emails.send(
        payload,
        {
          idempotencyKey,
        }
      )
    : await resend.emails.send(payload);

  const { data, error } = response;

  if (error) {
    throw new Error(
      error.message ||
        "Resend no pudo enviar el correo"
    );
  }

  return data;
};