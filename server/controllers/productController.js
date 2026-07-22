import {
  getAllProducts,
  createProductService,
} from "../services/productService.js";

import { validateCreateProduct } from "../validators/productValidator.js";

export const listProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const validation = validateCreateProduct(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: validation.errors,
      });
    }

    const product = await createProductService(req.body);

    res.status(201).json({
      message: "Producto creado correctamente",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
};