import express from "express";
import {
  listProducts,
  createProduct,
} from "../controllers/productController.js";


const router = express.Router();

router.get("/", listProducts);
router.post("/", createProduct);


export default router;