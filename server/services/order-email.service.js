import prisma from "../database/prisma.js";

import {
  getAdminEmail,
  sendTransactionalEmail,
} from "./email.service.js";

import {
  buildAdminOrderEmail,
  buildCustomerOrderEmail,
} from "../templates/order-email.templates.js";

const getErrorMessage = (error) =>
  String(
    error?.message ||
      "Error desconocido al enviar el correo"
  ).slice(0, 1500);

const loadOrder = async (orderNumber) =>
  prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      customer: true,
      items: true,
    },
  });

export const sendOrderConfirmationEmails =
  async (orderNumber) => {
    const order = await loadOrder(orderNumber);

    if (!order) {
      return {
        skipped: true,
        reason: "order_not_found",
      };
    }

    if (order.status !== "PAID") {
      return {
        skipped: true,
        reason: "order_not_paid",
      };
    }

    const errors = [];
    const result = {
      customer: {
        sent: Boolean(
          order.customerEmailSentAt
        ),
      },
      admin: {
        sent: Boolean(
          order.adminEmailSentAt
        ),
      },
    };

    /*
     * Correo del cliente.
     */
    if (!order.customerEmailSentAt) {
      try {
        const email =
          buildCustomerOrderEmail(order);

        const sent =
          await sendTransactionalEmail({
            to: order.customer.email,
            ...email,
            idempotencyKey:
              `order-paid/customer/${order.orderNumber}`,
          });

        await prisma.order.updateMany({
          where: {
            id: order.id,
            customerEmailSentAt: null,
          },
          data: {
            customerEmailSentAt: new Date(),
            customerEmailId:
              sent?.id || null,
          },
        });

        result.customer = {
          sent: true,
          id: sent?.id || null,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        errors.push(
          `Cliente: ${message}`
        );

        result.customer = {
          sent: false,
          error: message,
        };
      }
    }

    /*
     * Correo del administrador.
     */
    if (!order.adminEmailSentAt) {
      try {
        const email =
          buildAdminOrderEmail(order);

        const sent =
          await sendTransactionalEmail({
            to: getAdminEmail(),
            ...email,
            idempotencyKey:
              `order-paid/admin/${order.orderNumber}`,
          });

        await prisma.order.updateMany({
          where: {
            id: order.id,
            adminEmailSentAt: null,
          },
          data: {
            adminEmailSentAt: new Date(),
            adminEmailId:
              sent?.id || null,
          },
        });

        result.admin = {
          sent: true,
          id: sent?.id || null,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        errors.push(
          `Administrador: ${message}`
        );

        result.admin = {
          sent: false,
          error: message,
        };
      }
    }

    const currentState =
      await prisma.order.findUnique({
        where: {
          id: order.id,
        },
        select: {
          customerEmailSentAt: true,
          adminEmailSentAt: true,
        },
      });

    const completed = Boolean(
      currentState?.customerEmailSentAt &&
      currentState?.adminEmailSentAt
    );

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        confirmationSent: completed,
        emailLastError:
          errors.length > 0
            ? errors.join(" | ")
            : null,
      },
    });

    return {
      completed,
      errors,
      ...result,
    };
  };