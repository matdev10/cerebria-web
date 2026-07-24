import prisma from "../database/prisma.js";

const accessToken =
  process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

if (!accessToken) {
  throw new Error(
    "Falta MERCADO_PAGO_ACCESS_TOKEN en server/.env"
  );
}

const getPaymentFromMercadoPago = async (paymentId) => {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const payment = await response.json();

  if (!response.ok) {
    throw new Error(
      `Mercado Pago no permitió consultar el pago ${paymentId}. HTTP ${response.status}: ${
        payment.message || "Error desconocido"
      }`
    );
  }

  return payment;
};

const validatePaymentAgainstOrder = (payment, order) => {
  const paymentAmount = Number(payment.transaction_amount);
  const orderTotal = Number(order.total);

  if (paymentAmount !== orderTotal) {
    throw new Error(
      `El monto del pago ${payment.id} no coincide con la orden ${order.orderNumber}.`
    );
  }

  if (
    payment.currency_id &&
    payment.currency_id !== order.currency
  ) {
    throw new Error(
      `La moneda del pago ${payment.id} no coincide con la orden ${order.orderNumber}.`
    );
  }
};

export const processPaymentNotification = async (
  paymentId,
  expectedOrderNumber = null
) => {
  const payment = await getPaymentFromMercadoPago(
    paymentId
  );

  const orderNumber =
    payment.external_reference?.trim();

  if (!orderNumber) {
    return {
      ignored: true,
      reason: "payment_without_external_reference",
      paymentId: String(payment.id),
    };
  }

  if (
    expectedOrderNumber &&
    orderNumber !== String(expectedOrderNumber).trim()
  ) {
    const error = new Error(
      "El pago no corresponde a la orden indicada."
    );

    error.statusCode = 409;
    throw error;
  }

  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    return {
      ignored: true,
      reason: "order_not_found",
      paymentId: String(payment.id),
      orderNumber,
    };
  }

  validatePaymentAgainstOrder(payment, order);

  return prisma.$transaction(
    async (transaction) => {
      const currentOrder =
        await transaction.order.findUnique({
          where: {
            id: order.id,
          },
          include: {
            items: true,
          },
        });

      if (!currentOrder) {
        throw new Error(
          `La orden ${orderNumber} dejó de existir.`
        );
      }

      const paymentData = {
        paymentId: String(payment.id),
        paymentStatus: payment.status || null,
        paymentStatusDetail:
          payment.status_detail || null,
      };

      if (payment.status === "approved") {
        let stockUpdated =
          currentOrder.stockUpdated;

        let stockWarning = null;

        /*
         * Solo descontamos stock si todavía no fue actualizado.
         * Esto evita duplicar el descuento cuando Mercado Pago
         * repite la misma notificación.
         */
        if (!stockUpdated) {
          const productIds =
            currentOrder.items.map(
              (item) => item.productId
            );

          const products =
            await transaction.product.findMany({
              where: {
                id: {
                  in: productIds,
                },
              },
            });

          const productMap = new Map(
            products.map((product) => [
              product.id,
              product,
            ])
          );

          const itemsWithoutStock =
            currentOrder.items.filter((item) => {
              const product = productMap.get(
                item.productId
              );

              return (
                !product ||
                product.stock < item.quantity
              );
            });

          if (itemsWithoutStock.length === 0) {
            for (const item of currentOrder.items) {
              await transaction.product.update({
                where: {
                  id: item.productId,
                },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              });
            }

            stockUpdated = true;
          } else {
            stockWarning =
              "El pago fue aprobado, pero no se pudo descontar todo el stock automáticamente.";
          }
        }

        const updatedOrder =
          await transaction.order.update({
            where: {
              id: currentOrder.id,
            },
            data: {
              ...paymentData,
              status: "PAID",
              stockUpdated,
              paidAt: payment.date_approved
                ? new Date(payment.date_approved)
                : new Date(),
            },
          });


        return {
          updated: true,
          paymentId: String(payment.id),
          orderNumber,
          status: updatedOrder.status,
          stockUpdated,
          stockWarning,
        };
      }

      if (
        payment.status === "rejected" ||
        payment.status === "cancelled"
      ) {
        /*
         * Nunca degradamos una orden que ya había quedado PAID.
         */
        if (currentOrder.status === "PAID") {
          return {
            updated: false,
            reason: "order_already_paid",
            paymentId: String(payment.id),
            orderNumber,
          };
        }

        const updatedOrder =
          await transaction.order.update({
            where: {
              id: currentOrder.id,
            },
            data: {
              ...paymentData,
              status: "PAYMENT_REJECTED",
            },
          });

        return {
          updated: true,
          paymentId: String(payment.id),
          orderNumber,
          status: updatedOrder.status,
        };
      }

      if (payment.status === "refunded") {
        const updatedOrder =
          await transaction.order.update({
            where: {
              id: currentOrder.id,
            },
            data: {
              ...paymentData,
              status: "REFUNDED",
            },
          });

        return {
          updated: true,
          paymentId: String(payment.id),
          orderNumber,
          status: updatedOrder.status,
        };
      }

      /*
       * Para pending, in_process u otros estados,
       * actualizamos los datos del proveedor, pero la orden
       * continúa como PENDING_PAYMENT.
       */
      const updatedOrder =
        await transaction.order.update({
          where: {
            id: currentOrder.id,
          },
          data: paymentData,
        });

      return {
        updated: true,
        paymentId: String(payment.id),
        orderNumber,
        status: updatedOrder.status,
        paymentStatus: payment.status,
      };
    },
    {
      isolationLevel: "Serializable",
    }
  );
};