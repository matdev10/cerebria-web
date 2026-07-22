import { quoteShipping } from "../services/shipping.service.js";

export const getShippingQuote = async (req, res) => {
  try {
    const { communeId } = req.body;

    const quote = await quoteShipping({ communeId });

    return res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error("Error calculando envío:", error);

    return res.status(500).json({
      success: false,
      message: "Error al calcular el envío",
    });
  }
};