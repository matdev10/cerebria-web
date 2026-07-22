import crypto from "node:crypto";

import prisma from "../database/prisma.js";
import { createPaymentPreference } from "../services/payment.service.js";
import { validateCreatePreferencePayload } from "../validators/payment.validator.js";

const separateCustomerName = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() || "Cliente";
  const lastName = parts.length > 0 ? parts.join(" ") : null;

  return {
    firstName,
    lastName,
  };
};

const normalizeCartItems = (items) => {
  const productsMap = new Map();

  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);

    const existingItem = productsMap.get(productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      productsMap.set(productId, {
        productId,
        quantity,
      });
    }
  }

  return [...productsMap.values()];
};

const normalizeText = (value = "") => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
};

export const createPreference = async (req, res) => {
  try {
    const validation = validateCreatePreferencePayload(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: "Los datos enviados para iniciar el pago no son válidos.",
        errors: validation.errors,
      });
    }

    const {
      customer,
      shippingAddress,
      items,
      shippingCost,
    } = req.body;

    if (shippingAddress.countryIso.toUpperCase() !== "CL") {
      return res.status(400).json({
        success: false,
        message: "Actualmente solo se aceptan entregas dentro de Chile.",
      });
    }

    const normalizedItems = normalizeCartItems(items);
    const productIds = normalizedItems.map((item) => item.productId);

    const [databaseProducts, commune] = await Promise.all([
      prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          isActive: true,
        },
      }),

      prisma.geoCommune.findUnique({
        where: {
          id: shippingAddress.communeId,
        },
        include: {
          region: true,
          province: true,
        },
      }),
    ]);

    if (databaseProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message:
          "Uno o más productos no existen o ya no están disponibles.",
      });
    }

    if (!commune) {
      return res.status(400).json({
        success: false,
        message: "La comuna seleccionada no existe.",
      });
    }

    if (
      commune.regionId !== shippingAddress.regionId ||
      commune.provinceId !== shippingAddress.provinceId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "La región, provincia y comuna seleccionadas no corresponden entre sí.",
      });
    }

    const productMap = new Map(
      databaseProducts.map((product) => [product.id, product])
    );

    const orderItems = [];

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (product.stock < item.quantity) {
        return res.status(409).json({
          success: false,
          message: `No existe stock suficiente para ${product.name}.`,
        });
      }

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImageUrl: product.imageUrl,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
      });
    }

    const subtotal = orderItems.reduce(
      (accumulator, item) => accumulator + item.subtotal,
      0
    );

    const safeShippingCost = Number(shippingCost);
    const total = subtotal + safeShippingCost;

    const orderReference = `MW-${crypto.randomUUID()}`;

    const { firstName, lastName } = separateCustomerName(customer.name);

    const provinceName = normalizeText(commune.province.name);

    const shippingMethod = provinceName.includes("santiago")
      ? "SANTIAGO_DELIVERY"
      : "CHILEXPRESS_PAY_ON_DELIVERY";

    const order = await prisma.$transaction(async (transaction) => {
      let savedCustomer = await transaction.customer.findFirst({
        where: {
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
        },
      });

      if (savedCustomer) {
        savedCustomer = await transaction.customer.update({
          where: {
            id: savedCustomer.id,
          },
          data: {
            firstName,
            lastName,
          },
        });
      } else {
        savedCustomer = await transaction.customer.create({
          data: {
            firstName,
            lastName,
            email: customer.email.trim().toLowerCase(),
            phone: customer.phone.trim(),
          },
        });
      }

      return transaction.order.create({
        data: {
          orderNumber: orderReference,
          customerId: savedCustomer.id,
          shippingMethod,

          shippingRegionId: commune.region.id,
          shippingRegion: commune.region.name,

          shippingProvinceId: commune.province.id,
          shippingProvince: commune.province.name,

          shippingCommuneId: commune.id,
          shippingCommune: commune.name,

          shippingAddress: shippingAddress.address.trim(),
          shippingNotes: shippingAddress.notes?.trim() || null,

          shippingCost: safeShippingCost,
          subtotal,
          total,

          items: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });
    });

    const paymentItems = order.items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
    }));

    const preference = await createPaymentPreference({
      orderReference: order.orderNumber,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      items: paymentItems,
      shippingCost: safeShippingCost,
    });

    const paymentLink =
      process.env.NODE_ENV === "production"
        ? preference.initPoint
        : preference.sandboxInitPoint || preference.initPoint;

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentPreferenceId: preference.preferenceId,
        paymentLink,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderReference: order.orderNumber,
        subtotal,
        shippingCost: safeShippingCost,
        total,
        ...preference,
      },
    });
  } catch (error) {
    console.error("Error creando orden y preferencia:", error);

    return res.status(500).json({
      success: false,
      message:
        "No fue posible registrar el pedido e iniciar el pago.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};