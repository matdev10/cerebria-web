import { WebhookSignatureValidator } from "mercadopago";

import { processPaymentNotification } from "../services/webhook.service.js";

const getNotificationDataId = (req) => {
  return String(
    req.query["data.id"] ??
      req.body?.data?.id ??
      req.query.id ??
      ""
  ).trim();
};

const getNotificationType = (req) => {
  return String(
    req.query.type ??
      req.body?.type ??
      req.query.topic ??
      ""
  ).trim();
};

const validateWebhookSignature = (req, dataId) => {
  const secret =
    process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();

  /*
   * En desarrollo permitimos probar el endpoint manualmente
   * mientras todavía no tenemos la clave del panel.
   */
  if (!secret && process.env.NODE_ENV !== "production") {
    return;
  }

  if (!secret) {
    throw new Error(
      "Falta MERCADO_PAGO_WEBHOOK_SECRET en producción."
    );
  }

  const xSignature = req.headers["x-signature"];
  const xRequestId = req.headers["x-request-id"];
  const queryDataId = req.query["data.id"];

  if (!xSignature || !xRequestId || !queryDataId) {
    const error = new Error(
      "La notificación no contiene una firma válida."
    );

    error.statusCode = 401;
    throw error;
  }

  try {
    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId: String(queryDataId),
      secret,
    });
  } catch {
    const error = new Error(
      "La firma del webhook de Mercado Pago no es válida."
    );

    error.statusCode = 401;
    throw error;
  }
};

export const handleMercadoPagoWebhook = async (req, res) => {
  try {
    const dataId = getNotificationDataId(req);
    const notificationType = getNotificationType(req);

    if (!dataId) {
      return res.status(400).json({
        success: false,
        message: "La notificación no contiene un payment ID.",
      });
    }

    validateWebhookSignature(req, dataId);

    /*
     * Ignoramos otros eventos, pero respondemos 200 para que
     * Mercado Pago no siga reenviándolos.
     */
    if (
      notificationType &&
      notificationType !== "payment"
    ) {
      return res.status(200).json({
        success: true,
        ignored: true,
        reason: "unsupported_notification_type",
      });
    }

    const result = await processPaymentNotification(dataId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Error procesando webhook de Mercado Pago:",
      error
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 401
          ? error.message
          : "No fue posible procesar la notificación.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};