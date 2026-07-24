import "dotenv/config";
import process from "node:process";

import {
  getAdminEmail,
  sendTransactionalEmail,
} from "../services/email.service.js";

const formatDate = () =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "America/Santiago",
  }).format(new Date());

const run = async () => {
  const recipient = getAdminEmail();
  const sentAt = formatDate();

  const result = await sendTransactionalEmail({
    to: recipient,
    subject: "Prueba de correo — Cerebria®",
    text: [
      "Prueba de correo de Cerebria®.",
      "",
      "La integración con Resend está funcionando correctamente.",
      `Fecha: ${sentAt}`,
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="es">
        <body
          style="
            margin:0;
            padding:32px 16px;
            background:#f3f7f6;
            font-family:Arial,Helvetica,sans-serif;
            color:#123438;
          "
        >
          <div
            style="
              max-width:600px;
              margin:0 auto;
              overflow:hidden;
              border:1px solid #d8e5e2;
              border-radius:20px;
              background:#ffffff;
            "
          >
            <div
              style="
                padding:28px;
                background:#062c30;
                color:#ffffff;
              "
            >
              <p
                style="
                  margin:0 0 8px;
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:2px;
                  text-transform:uppercase;
                  color:#9bd6d1;
                "
              >
                Cerebria®
              </p>

              <h1
                style="
                  margin:0;
                  font-size:28px;
                  line-height:1.2;
                "
              >
                Prueba de correo exitosa
              </h1>
            </div>

            <div style="padding:28px;">
              <p
                style="
                  margin:0 0 18px;
                  font-size:16px;
                  line-height:1.7;
                "
              >
                La integración del backend con Resend está
                funcionando correctamente.
              </p>

              <div
                style="
                  padding:16px;
                  border-radius:12px;
                  background:#f1f7f5;
                "
              >
                <strong>Fecha de la prueba</strong>

                <p
                  style="
                    margin:6px 0 0;
                    color:#607579;
                  "
                >
                  ${sentAt}
                </p>
              </div>

              <p
                style="
                  margin:22px 0 0;
                  font-size:13px;
                  color:#718487;
                "
              >
                Este mensaje todavía no corresponde a una venta real.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  console.log(
    `Correo de prueba enviado correctamente. ID: ${result.id}`
  );
};

run().catch((error) => {
  console.error(
    "No se pudo enviar el correo de prueba:",
    error.message
  );

  process.exitCode = 1;
});